import apiClient from "@/api/axios"

export const getMe = async () => {
    const response = await apiClient.get("/user/me");
    return response.data;
}