"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { formatAuthError } from "@/lib/auth-utils";

type AuthMode = "signin" | "signup";

type AuthDialogProps = {
  open: boolean;
  onClose: () => void;
  callbackURL?: string;
  onSuccess?: () => void | Promise<void>;
};

export default function AuthDialog({
  open,
  onClose,
  callbackURL = "/events",
  onSuccess,
}: AuthDialogProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const resetForm = () => {
    setError(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  const handleSuccess = async () => {
    resetForm();
    onClose();

    if (onSuccess) {
      await onSuccess();
    } else {
      router.push(callbackURL);
    }

    router.refresh();
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });
    } catch {
      setError(
        "Google sign-in is not available. Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.",
      );
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const trimmedEmail = email.trim();

      if (mode === "signup") {
        const trimmedFirst = firstName.trim();
        const trimmedLast = lastName.trim();
        const name = `${trimmedFirst} ${trimmedLast}`.trim();

        if (!name) {
          setError("Please enter your first and last name.");
          return;
        }

        const { error: signUpError } = await authClient.signUp.email({
          name,
          email: trimmedEmail,
          password,
          firstName: trimmedFirst,
          lastName: trimmedLast,
          callbackURL,
        });

        if (signUpError) {
          setError(formatAuthError(signUpError));
          return;
        }
      } else {
        const { error: signInError } = await authClient.signIn.email({
          email: trimmedEmail,
          password,
          callbackURL,
        });

        if (signInError) {
          setError(formatAuthError(signInError));
          return;
        }
      }

      await handleSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-dialog-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-white/40 transition hover:text-white"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="mb-6 text-center">
          <h2
            id="auth-dialog-title"
            className="font-display text-3xl font-black tracking-tight text-[#e8192c]"
          >
            {mode === "signup" ? "Join the club" : "Welcome back"}
          </h2>
          <p className="mt-2 text-sm text-white/50">
            {mode === "signup"
              ? "Create an account to register for the next run."
              : "Sign in to continue to events."}
          </p>
        </div>

        <div className="mb-5 flex rounded-full border border-white/10 bg-white/5 p-1">
          {(["signup", "signin"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setMode(tab);
                setError(null);
              }}
              className={`flex-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                mode === tab
                  ? "bg-[#e8192c] text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {tab === "signup" ? "Sign up" : "Sign in"}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
        >
          <GoogleIcon />
          {mode === "signup" ? "Sign up with Google" : "Sign in with Google"}
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-wider text-white/30">
            or
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <div className="grid grid-cols-2 gap-3">
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
          )}

          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
          />

          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            required
            minLength={8}
          />

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-11 w-full items-center justify-center rounded-full bg-[#e8192c] text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#c91526] disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "signup"
                ? "Create account"
                : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  required,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/50">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e8192c]/60 focus:ring-2 focus:ring-[#e8192c]/20"
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
