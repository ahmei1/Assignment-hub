import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const authScenes = {
  login: {
    eyebrow: "Welcome back",
    title: "Your study space missed you.",
    description:
      "Pick up where you left off and turn today’s deadlines into tomorrow’s done list.",
    image: "/illustrations/auth-login.webp",
    alt: "Student happily returning to their coursework",
  },
  register: {
    eyebrow: "Start something brilliant",
    title: "A calmer semester starts here.",
    description:
      "Join your classmates and lecturers in one joyful, organized place for every assignment.",
    image: "/illustrations/auth-register.webp",
    alt: "Students celebrating a new Assignment Hub account",
  },
};

const AuthLayout = ({ children }) => {
  const { pathname } = useLocation();
  const scene = pathname === "/register" ? authScenes.register : authScenes.login;

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5FB] lg:flex-row">
      {/* Branding panel — hidden on small screens to keep the form front and center */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#303348] via-[#252736] to-[#1c1e2b] p-10 lg:flex lg:w-[46%] xl:p-14">
        <div className="brand-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#969DD9]/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#41455E]/40 blur-3xl" />

        <Link to="/" className="relative z-10 flex items-center gap-3">
          <div className="rounded-2xl bg-[#969DD9]/15 p-3">
            <GraduationCap size={26} className="text-[#B7BDF2]" />
          </div>
          <span className="font-[Syne] text-xl font-bold text-white">
            Assignment Hub
          </span>
        </Link>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center py-6 text-center">
          <motion.img
            key={scene.image}
            src={scene.image}
            alt={scene.alt}
            width="720"
            height="900"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
            transition={{
              opacity: { duration: 0.4 },
              scale: { duration: 0.5, ease: "easeOut" },
              y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="auth-art-transition h-auto max-h-[45vh] w-full max-w-[390px] object-contain drop-shadow-[0_28px_38px_rgba(10,11,20,0.32)]"
          />
          <motion.div
            key={scene.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="mt-2"
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#969DD9]">
              {scene.eyebrow}
            </p>
            <h1 className="mx-auto max-w-xl font-[Syne] text-4xl font-bold leading-tight text-white xl:text-[2.75rem]">
              {scene.title}
            </h1>
            <p className="mx-auto mt-3 max-w-md leading-7 text-gray-400">
              {scene.description}
            </p>
          </motion.div>
        </div>

        <p className="relative text-sm text-gray-500">
          © {new Date().getFullYear()} Assignment Hub
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#F5F5FB] px-4 py-10 sm:px-8">
        <div className="pointer-events-none absolute right-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-[#969DD9]/12 blur-3xl" aria-hidden="true" />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="auth-card-transition w-full max-w-md"
        >
          <Link
            to="/"
            className="mb-8 flex items-center justify-center gap-2 lg:hidden"
          >
            <div className="rounded-xl bg-[#252736] p-2">
              <GraduationCap size={20} className="text-[#B7BDF2]" />
            </div>
            <span className="font-[Syne] text-lg font-bold text-[#252736]">
              Assignment Hub
            </span>
          </Link>

          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
