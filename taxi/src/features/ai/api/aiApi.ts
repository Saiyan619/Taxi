import apiClient from "@/api/axios"


export const generateContent = async (data: {raw_text:string, tone: string}) => {
    const response = await apiClient.post("/ai/text-articulate", data)
    return response;   
}