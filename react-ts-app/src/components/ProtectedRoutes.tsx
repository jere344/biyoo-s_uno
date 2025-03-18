import { Navigate, Outlet, useLocation } from "react-router-dom";
import { storageAccessTokenKey } from "../data_services/CustomAxios";

function ProtectedRoutes() {
  const location = useLocation();
  
  if (!localStorage.getItem(storageAccessTokenKey)) {
    // Save the current path before redirecting
    localStorage.setItem("redirectPath", location.pathname);
    return <Navigate to="/login/" />;
  }
  
  return <Outlet />;
}

export default ProtectedRoutes;
