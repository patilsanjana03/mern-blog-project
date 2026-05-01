import { Navigate } from "react-router-dom";
import { getAuth } from "../utils/auth";

const ProtectedRoute = ({ children }) => {
  const auth = getAuth();
  const user = auth?.user;

  // ✅ check user instead of token
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;