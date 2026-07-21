import { useState } from "react";

// Deterministic, cheerful avatar for anyone who hasn't uploaded their own
// picture yet — same seed always renders the same avatar, so each user
// still looks visually distinct and consistent across sessions. "big-smile"
// gives bright, colorful, grinning faces — much more joyful than a plain
// initials circle.
const getDefaultAvatarUrl = (user) => {
  const seed = user?.id ?? user?.email ?? user?.name ?? "guest";
  return `https://api.dicebear.com/9.x/big-smile/svg?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear`;
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

// Shows the user's uploaded profile picture, or a generated default
// avatar when they haven't set one. `showStatus` adds the small green
// "online" dot used on the current user's own avatar.
const Avatar = ({ user, size = 44, showStatus = false, className = "" }) => {
  const dotSize = Math.max(10, Math.round(size * 0.28));
  // If the avatar image (own upload or the generated default) fails to
  // load — e.g. no internet access — fall back to plain initials rather
  // than showing a broken image icon.
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {imageFailed ? (
        <div
          className="flex h-full w-full items-center justify-center rounded-full bg-[#969DD9]/20 font-bold text-[#B7BDF2]"
          style={{ fontSize: size * 0.36 }}
        >
          {getInitials(user?.name)}
        </div>
      ) : (
        <img
          src={user?.avatarUrl || getDefaultAvatarUrl(user)}
          alt={
            user?.name ? `${user.name}'s profile picture` : "Profile picture"
          }
          onError={() => setImageFailed(true)}
          className="h-full w-full rounded-full border border-white/10 object-cover"
        />
      )}

      {showStatus && (
        <span
          title="Online"
          className="absolute rounded-full border-2 border-[#252736] bg-emerald-500"
          style={{
            width: dotSize,
            height: dotSize,
            right: -dotSize * 0.08,
            bottom: -dotSize * 0.08,
          }}
        />
      )}
    </div>
  );
};

export default Avatar;
