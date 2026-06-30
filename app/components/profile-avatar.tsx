import Image from "next/image";

import { getProfileInitials, getProfilePhoto, type ProfileUser } from "@/lib/profile";

type ProfileAvatarProps = {
  user: ProfileUser;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "size-10 text-xs",
  md: "size-12 text-sm",
  lg: "size-24 text-2xl",
};

const sizePixels = {
  sm: 40,
  md: 48,
  lg: 96,
};

export default function ProfileAvatar({
  user,
  size = "sm",
  className = "",
}: ProfileAvatarProps) {
  const photo = getProfilePhoto(user);
  const initials = getProfileInitials(user);
  const sizeClass = sizeClasses[size];

  if (photo) {
    return (
      <Image
        src={photo}
        alt=""
        width={sizePixels[size]}
        height={sizePixels[size]}
        className={`rounded-full object-cover ring-2 ring-white/20 ${sizeClass} ${className}`}
      />
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#e8192c] font-semibold text-white ring-2 ring-white/20 ${sizeClass} ${className}`}
      aria-hidden
    >
      {initials}
    </span>
  );
}
