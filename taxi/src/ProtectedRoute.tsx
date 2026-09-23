import { Navigate, Outlet } from "react-router"
import { useAuth } from "./stores/authStore";

const ProtectedRoute = () => {
    const isAuthenticated = useAuth((state) => state.isAuthenticated);
    const isAuthLoading = useAuth((state) => state.isAuthLoading);
    if (isAuthLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
       return <Navigate to="/login" replace />;
    }

    return <Outlet />
}

export default ProtectedRoute