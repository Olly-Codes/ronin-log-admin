import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {

    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/auth/login" replace />
    };

    return children;
};

export default ProtectedRoute;