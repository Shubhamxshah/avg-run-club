import type { EventImage } from "@/lib/types";

export const RUN_RAVE_IMAGES: EventImage[] = [
  {
    src: "/SaveClip.App_729654037_18087814901631083_340476392083462954_n.jpg",
    alt: "Run Rave & Coffee event poster",
  },
  {
    src: "/SaveClip.App_722215597_18087814910631083_5792295694583167699_n.jpg",
    alt: "Run Rave & Coffee partners and artists",
  },
  {
    src: "/SaveClip.App_726868023_18087814919631083_4289751263115446295_n.jpg",
    alt: "Run Rave & Coffee event schedule",
  },
];

export const PAST_RUN_RAVE = {
  id: "seed-run-rave-coffee",
  title: "Run Rave & Coffee",
  date: new Date("2026-06-28"),
  time: "5:45 AM",
  distance: "3K",
  location: "Dinkyard, Bholav Road",
  images: RUN_RAVE_IMAGES,
} as const;

export const UPCOMING_RUN_RAVE = {
  id: "seed-run-rave-coffee-next",
  title: "Run Rave & Coffee",
  date: new Date("2026-08-15"),
  time: "5:45 AM",
  distance: "3K",
  location: "Dinkyard, Bholav Road",
  images: RUN_RAVE_IMAGES,
} as const;

export function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function eventDateIso(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function parseEventImages(images: unknown): EventImage[] {
  if (!Array.isArray(images)) {
    return [];
  }

  return images.filter(
    (image): image is EventImage =>
      typeof image === "object" &&
      image !== null &&
      "src" in image &&
      typeof image.src === "string" &&
      "alt" in image &&
      typeof image.alt === "string",
  );
}
