import { Navigate } from "react-router-dom";
import { isUserAuthenticated } from "./auth.js";

const UserProtectedRoute = ({ children }) => {
  if (!isUserAuthenticated()) {
    return <Navigate to="/" replace />; 
  }
  return children;
};

export default UserProtectedRoute;
