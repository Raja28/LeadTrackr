import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const {isAuthenticated, status} = useSelector((state) => state.admin);

  if(status === "loading"){
    return null;
  }

  if(isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
}

export default ProtectedRoute;