"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { registerForEventAction } from "@/app/actions/register-for-event";
import AuthDialog from "@/app/components/auth-dialog";
import { authClient } from "@/lib/auth-client";

type EventRegisterButtonProps = {
  eventId: string;
  isRegistered: boolean;
  isRegisteredElsewhere: boolean;
};

export default function EventRegisterButton({
  eventId,
  isRegistered,
  isRegisteredElsewhere,
}: EventRegisterButtonProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(isRegistered);
  const [isPendingRegistration, startTransition] = useTransition();

  const registerCallbackUrl = `/events?register=${eventId}`;

  const completeRegistration = () => {
    startTransition(async () => {
      setError(null);
      const result = await registerForEventAction(eventId);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setRegistered(true);
      router.refresh();
    });
  };

  const handleClick = () => {
    setError(null);

    if (registered || isRegistered) {
      return;
    }

    if (isRegisteredElsewhere) {
      setError("You're already registered for another run.");
      return;
    }

    if (!session) {
      setAuthOpen(true);
      return;
    }

    completeRegistration();
  };

  const handleAuthSuccess = async () => {
    completeRegistration();
  };

  if (isRegisteredElsewhere && !registered && !isRegistered) {
    return (
      <p className="text-sm text-white/50">
        You&apos;re registered for another run.
      </p>
    );
  }

  if (registered || isRegistered) {
    return (
      <span className="inline-flex h-11 items-center rounded-full border border-[#e8192c]/40 bg-[#e8192c]/10 px-6 text-sm font-semibold uppercase tracking-wider text-[#e8192c]">
        Registered
      </span>
    );
  }

  return (
    <>
      <div className="flex flex-col items-start gap-2">
        <button
          type="button"
          onClick={handleClick}
          disabled={isPending || isPendingRegistration}
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#e8192c] px-8 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#c91526] disabled:opacity-60"
        >
          {isPendingRegistration ? "Registering..." : "Register"}
        </button>
        {error && <p className="text-sm text-red-300">{error}</p>}
      </div>

      <AuthDialog
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        callbackURL={registerCallbackUrl}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
