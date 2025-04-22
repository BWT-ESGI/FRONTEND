import isAuthenticated from "@/utils/isAuthenticated";
import { Navigate, Outlet } from "react-router-dom";

const IsAuthenticatedWall = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default IsAuthenticatedWall;