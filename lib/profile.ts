export type ProfileUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  displayPhoto?: string | null;
  bio?: string | null;
  phoneNumber?: string | null;
  phoneNumberVerified?: boolean | null;
};

export function getProfilePhoto(user: ProfileUser) {
  return user.displayPhoto ?? user.image ?? null;
}

export function getProfileInitials(user: ProfileUser) {
  const first = user.firstName?.trim()?.[0] ?? "";
  const last = user.lastName?.trim()?.[0] ?? "";

  if (first || last) {
    return `${first}${last}`.toUpperCase();
  }

  const parts = user.name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return (parts[0]?.[0] ?? user.email[0] ?? "?").toUpperCase();
}
