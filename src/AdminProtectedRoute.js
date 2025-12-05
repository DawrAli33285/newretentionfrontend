import { Navigate } from "react-router-dom";
import { isAdminAuthenticated } from "./auth.js";

const AdminProtectedRoute = ({ children }) => {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/adminlogin" replace />;  
  }
  return children;
};

export default AdminProtectedRoute;
