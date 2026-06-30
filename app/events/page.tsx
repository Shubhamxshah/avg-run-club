import EventPhotosCarousel from "../components/event-photos-carousel";
import Image from "next/image";
import Link from "next/link";

const RUN_RAVE_COFFEE = {
  title: "Run Rave & Coffee",
  date: "28 June 2026",
  time: "5:45 AM",
  distance: "3K",
  location: "Dinkyard, Bholav Road",
  images: [
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
  ],
} as const;

export const metadata = {
  title: "Events | AVG Run Club",
  description: "Upcoming and past AVG Run Club events.",
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 px-6 py-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-wider text-white/70 transition hover:text-white"
          >
            ← Home
          </Link>
          <Image
            src="/avg_logo.jpg"
            alt="AVG Run Club"
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
          />
        </div>
      </header>

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
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/3 px-8 py-14 text-center">
            <p className="font-display text-2xl font-black tracking-wide text-white/90 sm:text-3xl">
              Coming Soon
            </p>
            <p className="mx-auto mt-3 max-w-sm text-sm text-white/50">
              The next run is being planned. Check back here or follow us for
              updates.
            </p>
          </div>
        </section>

        <section aria-labelledby="past-heading">
          <h2
            id="past-heading"
            className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-[#e8192c]"
          >
            Past Events
          </h2>

          <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/3">
            <div className="border-b border-white/10 px-6 py-5 sm:px-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <time
                    dateTime="2026-06-28"
                    className="text-sm font-medium uppercase tracking-wider text-[#e8192c]"
                  >
                    28 June 2026
                  </time>
                  <h3 className="mt-1 font-display text-2xl font-black tracking-tight text-white sm:text-3xl">
                    {RUN_RAVE_COFFEE.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider">
                  <span className="rounded-full border border-white/20 px-3 py-1 text-white/80">
                    {RUN_RAVE_COFFEE.time}
                  </span>
                  <span className="rounded-full border border-white/20 px-3 py-1 text-white/80">
                    {RUN_RAVE_COFFEE.distance}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-white/50">
                {RUN_RAVE_COFFEE.location}
              </p>
            </div>

            <div className="py-4 sm:py-6">
              <EventPhotosCarousel slides={RUN_RAVE_COFFEE.images} />
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
