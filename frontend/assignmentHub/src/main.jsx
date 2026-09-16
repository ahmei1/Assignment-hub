import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { MotionConfig } from "framer-motion";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const app = (
  <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>
    <AuthProvider>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "14px",
            background: "#252736",
            color: "#fff",
            boxShadow: "0 18px 45px rgba(28, 30, 43, 0.2)",
          },
        }}
      />
    </AuthProvider>
  </MotionConfig>
);

createRoot(document.getElementById("root")).render(
  googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider>
  ) : (
    app
  ),
);
