import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Branding panel — hidden on small screens to keep the form front and center */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#303348] to-[#252736] p-10 lg:flex lg:w-1/2">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#969DD9]/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#41455E]/40 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="rounded-2xl bg-[#969DD9]/15 p-3">
            <GraduationCap size={26} className="text-[#B7BDF2]" />
          </div>
          <span className="text-xl font-bold text-white">Assignment Hub</span>
        </div>

        <div className="relative">
          <h1 className="text-4xl font-bold leading-tight text-white">
            Manage coursework the smart way.
          </h1>
          <p className="mt-4 max-w-md leading-7 text-gray-400">
            Track courses, assignments, and deadlines in one place — built
            for students and lecturers alike.
          </p>
        </div>

        <p className="relative text-sm text-gray-500">
          © {new Date().getFullYear()} Assignment Hub
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center bg-[#F5F5FB] px-4 py-10 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <div className="rounded-xl bg-[#252736] p-2">
              <GraduationCap size={20} className="text-[#B7BDF2]" />
            </div>
            <span className="text-lg font-bold text-[#252736]">
              Assignment Hub
            </span>
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
