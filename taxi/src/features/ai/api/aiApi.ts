import apiClient from "@/api/axios"


export const generateContent = async (data: {raw_text:string, tone: string}) => {
    const response = await apiClient.post("/ai/text-articulate", data)
    return response;   
}

export const getContentGenerated = async () => {
    const response = await apiClient.get("/ai/getArticulations");
    return response;
}

export const deleteContentGenerated = async (data: {id: string}) => {
    const response = await apiClient.delete(`/ai/deleteArticulations/${data.id}`);
    return response;
}

export const deleteAllContentGenerated = async () => {
    const response = await apiClient.delete("/ai/deleteAllArticulations")
    return response;
}