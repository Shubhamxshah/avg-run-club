"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const SLIDES = [
  {
    src: "/02.jpg",
    alt: "AVG Run Club group photo at the mall",
  },
  {
    src: "/03.jpg",
    alt: "AVG Run Club runners on the streets of Bharuch",
  },
  {
    src: "/04.jpg",
    alt: "AVG Run Club members holding the club flag",
  },
] as const;

export default function ImageCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;

    const slide = track.children[index] as HTMLElement | undefined;
    if (!slide) return;

    track.scrollTo({
      left: slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      Array.from(track.children).forEach((child, index) => {
        const slide = child as HTMLElement;
        const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
        const distance = Math.abs(center - slideCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    onScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="bg-black py-16 md:py-24">
      <div className="mb-10 px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#e8192c]">
          The Community
        </p>
        <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
          MOMENTS FROM THE CLUB
        </h2>
      </div>

      <div className="relative">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[calc(50%-42.5vw)] pb-2 scroll-smooth scrollbar-none sm:gap-6 sm:px-[calc(50%-27.5vw)] md:px-[calc(50%-220px)] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {SLIDES.map((slide, index) => (
            <div
              key={slide.src}
              className={`relative aspect-3/4 w-[85vw] shrink-0 snap-center overflow-hidden rounded-2xl transition-[transform,opacity] duration-500 sm:w-[55vw] md:w-[440px] ${
                index === activeIndex
                  ? "scale-100 opacity-100"
                  : "scale-[0.96] opacity-60"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 85vw, (max-width: 768px) 55vw, 440px"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 px-6">
          <button
            type="button"
            onClick={() => scrollToIndex(Math.max(activeIndex - 1, 0))}
            disabled={activeIndex === 0}
            aria-label="Previous photo"
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white/50 hover:bg-white/10 disabled:pointer-events-none disabled:opacity-30"
          >
            ←
          </button>

          <div className="flex items-center gap-2">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => scrollToIndex(index)}
                aria-label={`Go to photo ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex
                    ? "w-8 bg-[#e8192c]"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              scrollToIndex(Math.min(activeIndex + 1, SLIDES.length - 1))
            }
            disabled={activeIndex === SLIDES.length - 1}
            aria-label="Next photo"
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white/50 hover:bg-white/10 disabled:pointer-events-none disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
