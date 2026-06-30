import EventPhotosCarousel from "./event-photos-carousel";
import EventRegisterButton from "./event-register-button";
import type { EventImage } from "@/lib/types";
import {
  eventDateIso,
  formatEventDate,
} from "@/lib/run-rave-images";

type EventCardProps = {
  id: string;
  title: string;
  date: Date;
  time: string;
  distance: string | null;
  location: string;
  images: EventImage[];
  showRegister?: boolean;
  userEventId?: string | null;
};

export default function EventCard({
  id,
  title,
  date,
  time,
  distance,
  location,
  images,
  showRegister = false,
  userEventId = null,
}: EventCardProps) {
  const isRegistered = userEventId === id;
  const isRegisteredElsewhere = Boolean(userEventId && userEventId !== id);

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/3">
      <div className="border-b border-white/10 px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <time
              dateTime={eventDateIso(date)}
              className="text-sm font-medium uppercase tracking-wider text-[#e8192c]"
            >
              {formatEventDate(date)}
            </time>
            <h3 className="mt-1 font-display text-2xl font-black tracking-tight text-white sm:text-3xl">
              {title}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider">
            <span className="rounded-full border border-white/20 px-3 py-1 text-white/80">
              {time}
            </span>
            {distance && (
              <span className="rounded-full border border-white/20 px-3 py-1 text-white/80">
                {distance}
              </span>
            )}
          </div>
        </div>
        <p className="mt-3 text-sm text-white/50">{location}</p>

        {showRegister && (
          <div className="mt-5">
            <EventRegisterButton
              eventId={id}
              isRegistered={isRegistered}
              isRegisteredElsewhere={isRegisteredElsewhere}
            />
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="py-4 sm:py-6">
          <EventPhotosCarousel slides={images} />
        </div>
      )}
    </article>
  );
}
