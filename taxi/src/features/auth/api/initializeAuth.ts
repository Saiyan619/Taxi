import { attemptRefresh } from "@/api/axios"
import { useAuth } from "@/stores/authStore";

export const intializeAuth = async() => {
    try {
        const data = await attemptRefresh();
        if (data?.accessToken) {
            // Extract the setter function from the store
            const setAccessToken = useAuth.getState().setAccessToken;
            // Call it directly with your new token
            setAccessToken(data.accessToken as string | null);
            const setIsAuthenticated = useAuth.getState().setIsAuthenticated;
            const setIsAuthLoading = useAuth.getState().setIsAuthLoading;
            setIsAuthenticated(true);
            setIsAuthLoading(false);
        }else {
            useAuth.getState().setIsAuthenticated(false);
            useAuth.getState().clearToken();
        }
    } catch (error) {
        useAuth.getState().setIsAuthenticated(false);
        useAuth.getState().clearToken();
    } finally {
        useAuth.getState().setIsAuthLoading(false);
    }

}