import { Navigate } from "react-router-dom";
import isAuthentication, { checkToken } from "../services/authServices";

export const ProtectedRoute = ({ children }) => {
  

  if (!isAuthentication()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
