import apiClient from "@/api/axios"

export type UserProfile = {
    id: string;
    name: string | null;
    email: string;
    createdAt: string | null;
    updatedAt: string | null;
};

export type GetMeResponse = {
    message: string;
    user: UserProfile;
};

export const getMe = async () => {
    const response = await apiClient.get<GetMeResponse>("/user/me");
    return response.data;
}

export const updateUser = async (name: string) => {
    const response = await apiClient.patch<{ message: string; user: UserProfile }>("/user/me", { name });
    return response.data;
};