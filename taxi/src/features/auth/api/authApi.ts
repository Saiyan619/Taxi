import apiClient from "@/api/axios"
import { data } from "react-router";

export const register = async(data:{name: string, email: string, password: string}) => {
    const request = await apiClient.post("/auth/signup", data);
    return request.data;
}

export const verify = async (data: {token:string}) => {
    const request = await apiClient.post("/auth/verify", data);
    return request.data;
}

export const login = async (data: {email: string, password: string}) => {
    const response = await apiClient.post("/auth/login", data);

    return response.data;
}

export const logout = async () => {
    const response = await apiClient.post("/auth/logout", data);
    return response;
}

export const requestPasswordReset = async (data: {email: string}) => {
    const response = await apiClient.post("/auth/requirePassReset", data)
    return response.data;
}

export const resetPassword = async (data: { token: string; password: string }) => {
  const response = await apiClient.post(`/auth/resetPassword/${data.token}`, { password: data.password });
  return response.data;
};