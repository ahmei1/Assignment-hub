import Loader from "../components/Loader";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const ProtectedRoute = ({ children, role }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) return <Loader fullScreen label="Loading your workspace" />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
