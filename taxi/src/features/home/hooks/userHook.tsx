import { useQuery } from "@tanstack/react-query"
import { getMe } from "../api/userApi"

export const useGetMe = () => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["me"],
        queryFn: getMe,
        // enabled: false,
    })

    return { data, isLoading, isError, refetch }
}