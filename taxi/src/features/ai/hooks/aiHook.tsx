import { useMutation, useQuery } from "@tanstack/react-query"
import { generateContent, getContentGenerated } from "../api/aiApi"
import { toast } from "@/components/ui/toast";


export const useGenerateContent = () => {
    const {mutateAsync: generate, isPending, data} = useMutation({
        mutationFn: generateContent,
         onSuccess: (data) => {
            console.log(data?.data?.Generated_result);
            toast.add({
                type: "success",
                title: "Context Generation Successful",
                description: `Check if it fits your needs.`,
            });
        },
        onError: (error) => {
            console.error("Error generating content:", error);
            toast.add({
                type: "error",
                title: "Content Generation Failed",
                description: `Failed to generate content. Please try again.`,
                priority: "high",
            });
        }
    })

    return { generate, isPending, Generated_result: data?.data?.Generated_result };
}

export const useGetGeneratedContent = () => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["getGeneratedContent"],
        queryFn: getContentGenerated,
        // enabled: false,
    })

    return { generatedData: data?.data?.articulation, isLoading, isError, refetch }
}