import { Navigate } from "react-router-dom";
import isAuthentication from "../services/authServices";

export const PublicOnlyRoute = ({ children }) => {
  

  if (isAuthentication()) {
    return <Navigate to="/" replace />;
  }

  return children;
};