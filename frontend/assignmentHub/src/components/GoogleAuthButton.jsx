import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GraduationCap, Loader2, Presentation } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthProvider";

const GoogleAuthButton = ({ role }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [pendingCredential, setPendingCredential] = useState(null);
  const [loadingRole, setLoadingRole] = useState(null);
  const enabled = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  if (!enabled) return null;

  const authenticate = async (credential, selectedRole = role) => {
    try {
      const response = await api.post("/auth/google", {
        credential,
        ...(selectedRole ? { role: selectedRole } : {}),
      });
      const user = response.data.data.user;
      login(user);
      toast.success(response.data.message || "Signed in with Google.");
      navigate(user.role === "student" ? "/studentDashboard" : "/lecturerDashboard", {
        replace: true,
      });
    } catch (error) {
      if (error.response?.data?.code === "GOOGLE_ROLE_REQUIRED") {
        setPendingCredential(credential);
        return;
      }
      toast.error(error.response?.data?.message || "Google sign-in failed.");
    } finally {
      setLoadingRole(null);
    }
  };

  const handleSuccess = ({ credential }) => {
    if (!credential) return toast.error("Google did not return a credential.");
    authenticate(credential);
  };

  const finishRegistration = (selectedRole) => {
    setLoadingRole(selectedRole);
    authenticate(pendingCredential, selectedRole);
  };

  if (pendingCredential) {
    return (
      <div className="rounded-2xl border border-[#969DD9]/40 bg-[#969DD9]/10 p-4">
        <p className="text-center text-sm font-semibold text-gray-800">
          One last step: choose your account type
        </p>
        <p className="mt-1 text-center text-xs text-gray-500">
          This is only needed the first time you sign in.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            ["student", "Student", GraduationCap],
            ["lecturer", "Lecturer", Presentation],
          ].map(([value, label, Icon]) => (
            <button
              key={value}
              type="button"
              disabled={Boolean(loadingRole)}
              onClick={() => finishRegistration(value)}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#969DD9] bg-white px-3 py-3 text-sm font-semibold text-[#252736] transition hover:bg-[#969DD9]/10 disabled:cursor-wait disabled:opacity-60"
            >
              {loadingRole === value ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Icon size={18} />
              )}
              {label}
            </button>
          ))}
        </div>
      </div>
    );
  }

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
