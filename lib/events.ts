import type { EventImage } from "@/lib/types";
import { db } from "./db";

export type { EventImage };

export async function getEventById(id: string) {
  return db.event.findUnique({
    where: { id },
    include: { registrants: true },
  });
}

export async function getUpcomingEvents() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return db.event.findMany({
    where: { date: { gte: today } },
    orderBy: { date: "asc" },
    include: {
      _count: { select: { registrants: true } },
    },
  });
}

export async function getPastEvents() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return db.event.findMany({
    where: { date: { lt: today } },
    orderBy: { date: "desc" },
    include: {
      _count: { select: { registrants: true } },
    },
  });
}

export async function registerUserForEvent(input: {
  userId: string;
  eventId: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  displayPhoto?: string;
}) {
  const existing = await db.user.findUnique({
    where: { id: input.userId },
    select: { eventId: true },
  });

  if (existing?.eventId && existing.eventId !== input.eventId) {
    throw new Error("Already registered for another event");
  }

  const name =
    input.firstName && input.lastName
      ? `${input.firstName} ${input.lastName}`.trim()
      : undefined;

  return db.user.update({
    where: { id: input.userId },
    data: {
      eventId: input.eventId,
      ...(input.firstName && { firstName: input.firstName }),
      ...(input.lastName && { lastName: input.lastName }),
      ...(name && { name }),
      ...(input.phoneNumber && { phoneNumber: input.phoneNumber }),
      ...(input.displayPhoto && { displayPhoto: input.displayPhoto }),
    },
  });
}
