import { useMutation, useQuery } from "@tanstack/react-query"
import { deleteAllContentGenerated, deleteContentGenerated, generateContent, getContentGenerated } from "../api/aiApi"
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

export const useDeleteGeneratedContent = () => {
    const { mutateAsync: deleteContent, isPending, isError } = useMutation({
        mutationFn: deleteContentGenerated,
        onSuccess: () => {
            toast.add({
                type: "success",
                title: "Content Deletion Successful",
                description: `The generated content has been deleted.`,
            });
        },
        onError: (error) => {
            console.error("Error deleting content:", error);
            toast.add({
                type: "error",
                title: "Content Deletion Failed",
                description: `Failed to delete content. Please try again.`,
                priority: "high",
            });
        }
    });

    return { deleteContent, isPending, isError };
}

export const useDeleteAllGeneratedContent = () => {
    const { mutateAsync: deleteAllContent, isPending, isError } = useMutation({
        mutationFn: deleteAllContentGenerated,
        onSuccess: () => {
            toast.add({
                type: "success",
                title: "Content Deletion Successful",
                description: `The generated content has been deleted.`,
            });
        },
        onError: (error) => {
            console.error("Error deleting content:", error);
            toast.add({
                type: "error",
                title: "Content Deletion Failed",
                description: `Failed to delete content. Please try again.`,
                priority: "high",
            });
        }
    });

    return { deleteAllContent, isPending, isError };
}