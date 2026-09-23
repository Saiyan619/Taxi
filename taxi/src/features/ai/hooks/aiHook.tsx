import { useMutation } from "@tanstack/react-query"
import { generateContent } from "../api/aiApi"
import { toast } from "@/components/ui/toast";


export const useGenerateContent = () => {
    const {mutateAsync: generate, isPending, data} = useMutation({
        mutationFn: generateContent,
         onSuccess: (data) => {
            console.log(data);
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

    return { generate, isPending, data };
}