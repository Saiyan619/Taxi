import { attemptRefresh } from "@/api/axios"
import { useAuth } from "@/stores/authStore";

export const intializeAuth = async() => {
    try {
        console.log("Actually testing the auth refresh in intializeAuth function")
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
            console.log("auth protection successful")
        }else {
            useAuth.getState().setIsAuthenticated(false);
            useAuth.getState().clearToken();
            console.log("something went wrong with the initial auth")
        }
    } catch (error) {
        useAuth.getState().setIsAuthenticated(false);
        useAuth.getState().clearToken();
        console.log("initial auth failed")
    } finally {
        useAuth.getState().setIsAuthLoading(false);
        console.log("revert is loading to false, something went wrong ")
    }

}