import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";
import { useAuth } from "../context/AuthProvider";

const GoogleAuthButton = ({ role }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const enabled = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  if (!enabled) return null;

  const handleSuccess = async ({ credential }) => {
    if (!credential) return toast.error("Google did not return a credential.");
    if (role === "") return toast.error("Choose Student or Lecturer first.");

    try {
      const response = await api.post("/auth/google", {
        credential,
        ...(role ? { role } : {}),
      });
      const user = response.data.data.user;
      login(user);
      toast.success(response.data.message || "Signed in with Google.");
      navigate(user.role === "student" ? "/studentDashboard" : "/lecturerDashboard", {
        replace: true,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Google sign-in failed.");
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error("Google sign-in was cancelled or failed.")}
        shape="pill"
        size="large"
        width="320"
        text={role ? "signup_with" : "signin_with"}
      />
    </div>
  );
};

export default GoogleAuthButton;
