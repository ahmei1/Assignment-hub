import axios from "axios";

// In production the frontend calls same-origin `/api`, which Vercel proxies
 // to Render. That keeps auth cookies first-party so mobile Safari/Chrome
// don't block them (cross-site cookies between vercel.app and onrender.com
// are what caused "Dashboard unavailable" on phones).
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "http://localhost:5000/api" : "/api"),
  withCredentials: true,
});

export default api;
