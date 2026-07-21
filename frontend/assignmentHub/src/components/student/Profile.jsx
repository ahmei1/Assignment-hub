import {
  BookOpenText,
  Camera,
  CheckCircle2,
  Clock3,
  KeyRound,
  Loader2,
  NotebookText,
  UserRoundPen,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthProvider";
import Avatar from "../Avatar";
import Loader from "../Loader";
import { pageVariants, staggerContainer, staggerItem } from "../../lib/motion";

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [savingProfile, setSavingProfile] = useState(false);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const endpoint =
          user?.role === "lecturer"
            ? "/dashboard/lecturer"
            : "/dashboard/student";
        const response = await api.get(endpoint);
        setStats(response.data.data.stats);
      } catch {
        // Stats are a nice-to-have here; fail silently rather than
        // blocking the rest of the profile page.
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [user?.role]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploadingAvatar(true);
      const response = await api.put("/auth/me/avatar", formData);
      updateUser(response.data.data.user);
      toast.success(response.data.message || "Profile picture updated.");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Couldn’t update your profile picture.",
      );
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      setSavingProfile(true);
      const response = await api.put("/auth/me", { name, email });
      updateUser(response.data.data.user);
      toast.success(response.data.message || "Profile updated.");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Couldn’t update your profile.",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation don’t match.");
      return;
    }

    try {
      setSavingPassword(true);
      const response = await api.put("/auth/me/password", {
        currentPassword,
        newPassword,
      });
      toast.success(response.data.message || "Password changed.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Couldn’t change your password.",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const isLecturer = user?.role === "lecturer";

  const statCards = isLecturer
    ? [
        { key: "courses", label: "Courses", icon: BookOpenText },
        { key: "assignments", label: "Assignments", icon: NotebookText },
        { key: "submissions", label: "Submissions", icon: CheckCircle2 },
      ]
    : [
        { key: "courses", label: "Courses", icon: BookOpenText },
        { key: "assignments", label: "Assignments", icon: NotebookText },
        { key: "submitted", label: "Submitted", icon: CheckCircle2 },
        { key: "dueSoon", label: "Due soon", icon: Clock3 },
      ];

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="min-h-full space-y-8 p-5 sm:p-8"
    >
      {/* Header */}
      <section className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#303348] to-[#252736] p-6 shadow-xl sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative h-[84px] w-[84px] shrink-0">
            <Avatar user={user} size={84} showStatus />

            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              title="Change profile picture"
              className={`absolute inset-0 flex items-center justify-center rounded-full text-white transition hover:bg-black/50 hover:opacity-100 disabled:cursor-not-allowed ${
                uploadingAvatar ? "bg-black/50 opacity-100" : "bg-black/0 opacity-0"
              }`}
            >
              {uploadingAvatar ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Camera size={20} />
              )}
            </button>

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {user?.name}
            </h1>
            <p className="mt-1 text-gray-400">{user?.email}</p>
            <span className="mt-2 inline-block rounded-full bg-[#969DD9]/15 px-3 py-1 text-xs font-bold capitalize tracking-wide text-[#B7BDF2]">
              {user?.role}
            </span>
          </div>
        </div>
      </section>

      {/* Stats */}
      {statsLoading ? (
        <Loader />
      ) : stats ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className={`grid grid-cols-2 gap-4 ${
            isLecturer ? "sm:grid-cols-3" : "sm:grid-cols-4"
          }`}
        >
          {statCards.map(({ key, label, icon: Icon }) => (
            <motion.div
              key={key}
              variants={staggerItem}
              className="rounded-3xl border border-white/10 bg-white/5 p-5"
            >
              <Icon size={22} className="mb-3 text-[#B7BDF2]" />
              <p className="text-2xl font-bold text-white">{stats[key]}</p>
              <p className="text-sm text-gray-400">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Update profile */}
        <section className="rounded-3xl bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-[#252736] p-3">
              <UserRoundPen size={22} className="text-[#B7BDF2]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Edit profile
            </h2>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 p-4 text-gray-800 outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 p-4 text-gray-800 outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#252736] py-3 font-semibold text-white transition duration-300 hover:bg-[#41455E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingProfile ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </form>
        </section>

        {/* Change password */}
        <section className="rounded-3xl bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-[#252736] p-3">
              <KeyRound size={22} className="text-[#B7BDF2]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Change password
            </h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Current password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 p-4 text-gray-800 outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                New password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 p-4 text-gray-800 outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 p-4 text-gray-800 outline-none transition focus:border-[#969DD9] focus:ring-2 focus:ring-[#969DD9]/20"
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#252736] py-3 font-semibold text-white transition duration-300 hover:bg-[#41455E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingPassword ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                "Update password"
              )}
            </button>
          </form>
        </section>
      </div>
    </motion.main>
  );
};

export default Profile;
