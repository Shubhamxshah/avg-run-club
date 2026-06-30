"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import ProfileAvatar from "@/app/components/profile-avatar";
import { authClient } from "@/lib/auth-client";
import type { ProfileUser } from "@/lib/profile";

type ProfileMenuProps = {
  className?: string;
};

export default function ProfileMenu({ className = "" }: ProfileMenuProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (isPending || !session?.user) {
    return null;
  }

  const user = session.user as ProfileUser;

  const handleSignOut = async () => {
    setOpen(false);
    await authClient.signOut();
    router.refresh();
  };

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded-full transition hover:ring-2 hover:ring-[#e8192c]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8192c]"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        <ProfileAvatar user={user} size="sm" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-44 overflow-hidden rounded-xl border border-white/10 bg-zinc-950 py-1 shadow-xl"
        >
          <div className="border-b border-white/10 px-4 py-3">
            <p className="truncate text-sm font-semibold text-white">
              {user.name}
            </p>
            <p className="truncate text-xs text-white/50">{user.email}</p>
          </div>
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
          >
            Edit profile
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="block w-full px-4 py-2.5 text-left text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
