import { Check } from "lucide-react";

const Loader = ({ label = "Loading this section", fullScreen = false }) => (
  <div className={`${fullScreen ? "fixed inset-0 z-[100] min-h-screen bg-[#F4F5FA]" : "min-h-[calc(100dvh-4.5rem)] w-full bg-white/[0.025]"} grid place-items-center px-6`} role="status" aria-live="polite">
    <div className="text-center">
      <div className="study-loader" aria-hidden="true">
        <div className="study-loader-shadow" />
        <div className="study-loader-book">
          <div className="study-loader-pages" />
          <div className="study-loader-cover">
            <span className="study-loader-spine" />
            <span className="study-loader-line" />
            <span className="study-loader-line study-loader-line-short" />
            <span className="study-loader-seal"><Check size={24} strokeWidth={3} /></span>
          </div>
        </div>
        <span className="study-loader-orb" />
      </div>
      <p className={`mt-2 text-sm font-semibold ${fullScreen ? "text-[#41455E]" : "text-[#D5D8F0]"}`}>{label}</p>
      <div className="study-loader-dots" aria-hidden="true"><span /><span /><span /></div>
      <span className="sr-only">Please wait</span>
    </div>
  </div>
);
export default Loader;
