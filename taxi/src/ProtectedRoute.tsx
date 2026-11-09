import { Navigate, Outlet } from "react-router"
import { Loader2 } from "lucide-react";
import { useAuth } from "./stores/authStore";

const ProtectedRoute = () => {
    const isAuthenticated = useAuth((state) => state.isAuthenticated);
    const isAuthLoading = useAuth((state) => state.isAuthLoading);
    if (isAuthLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center" aria-label="Loading">
                <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
            </div>
        );
    }

    if (!isAuthenticated) {
       return <Navigate to="/login" replace />;
    }

    return <Outlet />
}

export default ProtectedRoute