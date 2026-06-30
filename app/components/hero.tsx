import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="/01.jpg"
        alt="AVG Run Club community group photo"
        fill
        priority
        className="object-cover object-[center_65%] animate-[hero-zoom_20s_ease-out_forwards]"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/25 to-black/80" />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

      <div className="relative z-10 flex min-h-screen flex-col items-center px-6 pt-24 pb-16 text-center sm:pt-32 md:pt-36">
        <div className="animate-[fade-up_0.8s_ease-out_both]">
          <Image
            src="/avg_logo.jpg"
            alt=""
            width={72}
            height={72}
            className="mx-auto mb-8 size-16 rounded-full object-cover ring-2 ring-white/20 sm:size-[4.5rem]"
            aria-hidden
          />

          <h1 className="font-display leading-none">
            <span className="block text-[clamp(4.5rem,18vw,9rem)] font-black tracking-tighter text-[#e8192c] drop-shadow-[0_4px_24px_rgba(232,25,44,0.45)]">
              AVG
            </span>
            <span className="mt-1 block text-[clamp(1.25rem,4.5vw,2.25rem)] font-semibold tracking-[0.35em] text-white sm:tracking-[0.45em]">
              RUN CLUB
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-white/75 sm:text-lg">
            Show up. Run together. Leave stronger.
          </p>
        </div>

        <div className="mt-10 flex w-full animate-[fade-up_0.8s_ease-out_0.15s_both] flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/events"
            className="inline-flex h-12 items-center justify-center rounded-full border-2 border-white/80 bg-white/5 px-8 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition hover:border-white hover:bg-white/15"
          >
            Past events
          </Link>
          <Link
            href="/register"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#e8192c] px-8 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_8px_32px_rgba(232,25,44,0.45)] transition hover:bg-[#c91526] hover:shadow-[0_12px_40px_rgba(232,25,44,0.55)]"
          >
            Register
          </Link>
        </div>

        <div className="mt-auto animate-[fade-up_0.8s_ease-out_0.3s_both] pt-16">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-white/40">
            Scroll
          </span>
          <div className="mx-auto mt-2 h-10 w-px bg-linear-to-b from-white/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
