import EventCard from "../components/event-card";
import PendingRegistration from "../components/pending-registration";
import SiteHeader from "../components/site-header";
import { auth } from "@/lib/auth";
import { getPastEvents, getUpcomingEvents } from "@/lib/events";
import {
  PAST_RUN_RAVE,
  UPCOMING_RUN_RAVE,
  parseEventImages,
} from "@/lib/run-rave-images";
import { headers } from "next/headers";
import { Suspense } from "react";

export const metadata = {
  title: "Events | AVG Run Club",
  description: "Upcoming and past AVG Run Club events.",
};

type EventRecord = {
  id: string;
  title: string;
  date: Date;
  time: string;
  distance: string | null;
  location: string;
  images: unknown;
};

const STATIC_UPCOMING: EventRecord = {
  id: UPCOMING_RUN_RAVE.id,
  title: UPCOMING_RUN_RAVE.title,
  date: UPCOMING_RUN_RAVE.date,
  time: UPCOMING_RUN_RAVE.time,
  distance: UPCOMING_RUN_RAVE.distance,
  location: UPCOMING_RUN_RAVE.location,
  images: UPCOMING_RUN_RAVE.images,
};

const STATIC_PAST: EventRecord = {
  id: PAST_RUN_RAVE.id,
  title: PAST_RUN_RAVE.title,
  date: PAST_RUN_RAVE.date,
  time: PAST_RUN_RAVE.time,
  distance: PAST_RUN_RAVE.distance,
  location: PAST_RUN_RAVE.location,
  images: PAST_RUN_RAVE.images,
};

async function loadEvents() {
  try {
    const [upcoming, past] = await Promise.all([
      getUpcomingEvents(),
      getPastEvents(),
    ]);

    return {
      upcoming: upcoming.length > 0 ? upcoming : [STATIC_UPCOMING],
      past: past.length > 0 ? past : [STATIC_PAST],
    };
  } catch {
    return {
      upcoming: [STATIC_UPCOMING],
      past: [STATIC_PAST],
    };
  }
}

export default async function EventsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userEventId =
    (session?.user as { eventId?: string | null } | undefined)?.eventId ??
    null;

  const { upcoming, past } = await loadEvents();

  return (
    <div className="min-h-screen bg-black text-white">
      <Suspense fallback={null}>
        <PendingRegistration />
      </Suspense>

      <SiteHeader />

      <main className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <div className="mb-12 text-center md:mb-16">
          <h1 className="font-display text-4xl font-black tracking-tight text-[#e8192c] sm:text-5xl">
            EVENTS
          </h1>
          <p className="mt-3 text-white/60">
            What&apos;s next — and what we&apos;ve already run.
          </p>
        </div>

        <section aria-labelledby="upcoming-heading" className="mb-16 md:mb-20">
          <h2
            id="upcoming-heading"
            className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-[#e8192c]"
          >
            Upcoming Events
          </h2>

          {upcoming.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/3 px-8 py-14 text-center">
              <p className="font-display text-2xl font-black tracking-wide text-white/90 sm:text-3xl">
                Coming Soon
              </p>
              <p className="mx-auto mt-3 max-w-sm text-sm text-white/50">
                The next run is being planned. Check back here or follow us for
                updates.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {upcoming.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  time={event.time}
                  distance={event.distance}
                  location={event.location}
                  images={parseEventImages(event.images)}
                  showRegister
                  userEventId={userEventId}
                />
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="past-heading">
          <h2
            id="past-heading"
            className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-[#e8192c]"
          >
            Past Events
          </h2>

          {past.length === 0 ? (
            <p className="text-sm text-white/50">No past events yet.</p>
          ) : (
            <div className="space-y-8">
              {past.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  time={event.time}
                  distance={event.distance}
                  location={event.location}
                  images={parseEventImages(event.images)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
