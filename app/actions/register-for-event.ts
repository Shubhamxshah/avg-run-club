"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { registerUserForEvent } from "@/lib/events";

export type RegisterForEventResult =
  | { ok: true }
  | { ok: false; error: string };

export async function registerForEventAction(
  eventId: string,
): Promise<RegisterForEventResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { ok: false, error: "Please sign in to register." };
  }

  const user = session.user;

  if (user.eventId === eventId) {
    return { ok: true };
  }

  if (user.eventId && user.eventId !== eventId) {
    return {
      ok: false,
      error: "You're already registered for another run.",
    };
  }

  try {
    await registerUserForEvent({
      userId: user.id,
      eventId,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
    });
    revalidatePath("/events");
    return { ok: true };
  } catch {
    return { ok: false, error: "Registration failed. Please try again." };
  }
}
