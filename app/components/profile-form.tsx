"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import ProfileAvatar from "@/app/components/profile-avatar";
import { authClient } from "@/lib/auth-client";
import { formatAuthError } from "@/lib/auth-utils";
import { getProfilePhoto, type ProfileUser } from "@/lib/profile";

type ProfileFormProps = {
  user: ProfileUser;
};

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? "");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(getProfilePhoto(user));
  const [photoMenuOpen, setPhotoMenuOpen] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(
    Boolean(user.phoneNumberVerified),
  );

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const displayUser: ProfileUser = {
    ...user,
    firstName,
    lastName,
    displayPhoto: photoUrl,
  };

  useEffect(() => {
    if (!photoMenuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPhotoMenuOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [photoMenuOpen]);

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setPhotoMenuOpen(false);
    setError(null);
    setMessage(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await fetch("/api/profile/photo", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok) {
        setError(payload.error ?? "Failed to upload photo");
        return;
      }

      setPhotoUrl(payload.url ?? null);

      const { error: updateError } = await authClient.updateUser({
        displayPhoto: payload.url,
      });

      if (updateError) {
        setError(formatAuthError(updateError));
        return;
      }

      setMessage("Photo updated.");
      router.refresh();
    } catch {
      setError("Failed to upload photo");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePhoto = async () => {
    setPhotoMenuOpen(false);
    setError(null);
    setMessage(null);
    setRemoving(true);

    try {
      await fetch("/api/profile/photo", { method: "DELETE" });

      const { error: updateError } = await authClient.updateUser({
        displayPhoto: null,
        image: null,
      });

      if (updateError) {
        setError(formatAuthError(updateError));
        return;
      }

      setPhotoUrl(null);
      setMessage("Photo removed.");
      router.refresh();
    } catch {
      setError("Failed to remove photo");
    } finally {
      setRemoving(false);
    }
  };

  const handleUploadClick = () => {
    setPhotoMenuOpen(false);
    fileInputRef.current?.click();
  };

  const photoBusy = uploading || removing;

  const handleSendOtp = async () => {
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedPhone) {
      setError("Enter a phone number first.");
      return;
    }

    setError(null);
    setMessage(null);
    setSendingOtp(true);

    try {
      const { error: otpError } = await authClient.phoneNumber.sendOtp({
        phoneNumber: trimmedPhone,
      });

      if (otpError) {
        setError(formatAuthError(otpError));
        return;
      }

      setOtpSent(true);
      setMessage("Verification code sent. Check your phone (or dev console).");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    const trimmedPhone = phoneNumber.trim();
    const trimmedOtp = otp.trim();

    if (!trimmedPhone || !trimmedOtp) {
      setError("Enter your phone number and verification code.");
      return;
    }

    setError(null);
    setMessage(null);
    setVerifyingOtp(true);

    try {
      const { error: verifyError } = await authClient.phoneNumber.verify({
        phoneNumber: trimmedPhone,
        code: trimmedOtp,
        updatePhoneNumber: true,
        disableSession: true,
      });

      if (verifyError) {
        setError(formatAuthError(verifyError));
        return;
      }

      setPhoneVerified(true);
      setOtp("");
      setOtpSent(false);
      setMessage("Phone number verified.");
      router.refresh();
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);

    try {
      const trimmedFirst = firstName.trim();
      const trimmedLast = lastName.trim();
      const trimmedBio = bio.trim();
      const name = `${trimmedFirst} ${trimmedLast}`.trim();

      if (!name) {
        setError("First and last name are required.");
        return;
      }

      const { error: updateError } = await authClient.updateUser({
        name,
        firstName: trimmedFirst,
        lastName: trimmedLast,
        bio: trimmedBio || undefined,
      });

      if (updateError) {
        setError(formatAuthError(updateError));
        return;
      }

      setMessage("Profile saved.");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <section className="flex flex-col items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => setPhotoMenuOpen(true)}
          disabled={photoBusy}
          className="group relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8192c] disabled:opacity-60"
          aria-label="Change profile photo"
        >
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt=""
              width={112}
              height={112}
              className="size-28 rounded-full object-cover ring-2 ring-white/20 transition group-hover:ring-[#e8192c]/50"
            />
          ) : (
            <ProfileAvatar user={displayUser} size="lg" className="size-28 text-3xl" />
          )}
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 text-white/0 transition group-hover:bg-black/45 group-hover:text-white/90">
            <CameraIcon />
          </span>
          {photoBusy && (
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 text-xs font-semibold uppercase tracking-wider text-white">
              {uploading ? "Uploading" : "Removing"}
            </span>
          )}
        </button>

        <p className="text-xs text-white/45">Tap photo to change</p>
      </section>

      {photoMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
          onClick={() => setPhotoMenuOpen(false)}
          role="presentation"
        >
          <div
            className="w-full max-w-xs rounded-2xl border border-white/10 bg-zinc-950 p-2 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="photo-menu-title"
          >
            <p
              id="photo-menu-title"
              className="px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Profile photo
            </p>
            <button
              type="button"
              onClick={handleUploadClick}
              className="flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5"
            >
              Upload new photo
            </button>
            {photoUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
              >
                Remove photo
              </button>
            )}
            <button
              type="button"
              onClick={() => setPhotoMenuOpen(false)}
              className="mt-1 flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-white/50 transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="First name"
          value={firstName}
          onChange={setFirstName}
          autoComplete="given-name"
          required
        />
        <Field
          label="Last name"
          value={lastName}
          onChange={setLastName}
          autoComplete="family-name"
          required
        />
      </div>

      <Field
        label="Email"
        value={user.email}
        onChange={() => {}}
        type="email"
        readOnly
        hint="Email cannot be changed here."
      />

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/50">
          Bio <span className="normal-case tracking-normal text-white/30">(optional)</span>
        </span>
        <textarea
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          maxLength={160}
          rows={3}
          placeholder="A line or two about you and your running..."
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e8192c]/60 focus:ring-2 focus:ring-[#e8192c]/20"
        />
        <span className="mt-1 block text-right text-xs text-white/30">
          {bio.length}/160
        </span>
      </label>

      <section className="rounded-2xl border border-white/10 bg-white/3 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Phone number</h2>
            <p className="mt-1 text-xs text-white/50">
              Verify your number so we can reach you about runs.
            </p>
          </div>
          {phoneVerified && (
            <span className="shrink-0 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
              Verified
            </span>
          )}
        </div>

        <div className="space-y-3">
          <Field
            label="Phone"
            value={phoneNumber}
            onChange={(value) => {
              setPhoneNumber(value);
              setPhoneVerified(false);
              setOtpSent(false);
            }}
            type="tel"
            autoComplete="tel"
            placeholder="+1 555 000 0000"
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={sendingOtp || !phoneNumber.trim()}
              className="inline-flex h-10 items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white/10 disabled:opacity-60"
            >
              {sendingOtp ? "Sending..." : "Send code"}
            </button>

          {otpSent && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <Field
                label="Verification code"
                value={otp}
                onChange={setOtp}
                placeholder="6-digit code"
                className="sm:flex-1"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={verifyingOtp || !otp.trim()}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#e8192c] px-5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#c91526] disabled:opacity-60"
              >
                {verifyingOtp ? "Verifying..." : "Verify"}
              </button>
            </div>
          )}
          </div>
        </div>
      </section>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {message && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="flex h-11 w-full items-center justify-center rounded-full bg-[#e8192c] text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#c91526] disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {saving ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  required,
  readOnly,
  placeholder,
  hint,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/50">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        required={required}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e8192c]/60 focus:ring-2 focus:ring-[#e8192c]/20 ${
          readOnly ? "cursor-not-allowed text-white/50" : ""
        }`}
      />
      {hint && <span className="mt-1 block text-xs text-white/35">{hint}</span>}
    </label>
  );
}

function CameraIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="size-7"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.5 8h3l1.5-2h3L15.5 8H18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z"
      />
      <circle cx="12" cy="14" r="3.25" />
    </svg>
  );
}
