import { GraduationCap } from "lucide-react";

const Loader = ({ label = "Loading this section", fullScreen = false }) => (
  <div
    className={`${
      fullScreen
        ? "fixed inset-0 z-[100] min-h-screen bg-[#F4F5FA]/95 backdrop-blur-sm"
        : "min-h-[calc(100dvh-4.5rem)] w-full bg-white/[0.025]"
    } grid place-items-center px-6`}
    role="status"
    aria-live="polite"
  >
    <div className="text-center">
      <div className="relative mx-auto grid h-20 w-20 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-3xl bg-[#969DD9]/20" aria-hidden="true" />
        <span className="absolute inset-1 animate-spin rounded-3xl border-2 border-[#969DD9]/20 border-t-[#646B9E]" aria-hidden="true" />
        <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-[#252736] shadow-xl">
          <GraduationCap size={27} className="text-[#B7BDF2]" aria-hidden="true" />
        </span>
      </div>
      <p className={`mt-5 text-sm font-semibold ${fullScreen ? "text-[#41455E]" : "text-[#D5D8F0]"}`}>
        {label}
      </p>
      <span className="sr-only">Please wait</span>
    </div>
  </div>
);

export default Loader;
