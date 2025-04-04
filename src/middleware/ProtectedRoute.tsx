import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
    return true;
};

const ProtectedRoute = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;