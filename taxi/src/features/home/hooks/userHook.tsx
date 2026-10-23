import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios";
import { toast } from "@/components/ui/toast";
import { getMe, updateUser } from "../api/userApi"

export const useGetMe = () => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["me"],
        queryFn: getMe,
        // enabled: false,
    })

    return { data, isLoading, isError, refetch }
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: updateUser,
        onSuccess: (data) => {
            queryClient.setQueryData(["me"], data);
            toast.add({
                type: "success",
                title: "Profile updated",
                description: "Your display name has been saved.",
            });
        },
        onError: (error) => {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message ?? error.message
                : "Please try again.";
            toast.add({
                type: "error",
                title: "Unable to update profile",
                description: message,
                priority: "high",
            });
        },
    });

    return {
        ...mutation,
        updateUser: mutation.mutateAsync,
    };
};