"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { registerForEventAction } from "@/app/actions/register-for-event";
import { authClient } from "@/lib/auth-client";

export default function PendingRegistration() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = authClient.useSession();
  const handled = useRef(false);

  useEffect(() => {
    const eventId = searchParams.get("register");

    if (!eventId || !session || handled.current) {
      return;
    }

    handled.current = true;

    void (async () => {
      await registerForEventAction(eventId);
      router.replace("/events");
      router.refresh();
    })();
  }, [router, searchParams, session]);

  return null;
}
