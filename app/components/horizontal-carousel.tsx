"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type CarouselSlide = {
  src: string;
  alt: string;
};

type HorizontalCarouselProps = {
  slides: readonly CarouselSlide[];
  compact?: boolean;
};

export default function HorizontalCarousel({
  slides,
  compact = false,
}: HorizontalCarouselProps) {
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

  const slideWidth = compact
    ? "w-[75vw] sm:w-[280px]"
    : "w-[85vw] sm:w-[55vw] md:w-[440px]";

  const trackPadding = compact
    ? "px-[calc(50%-37.5vw)] sm:px-[calc(50%-140px)]"
    : "px-[calc(50%-42.5vw)] sm:px-[calc(50%-27.5vw)] md:px-[calc(50%-220px)]";

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className={`flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scroll-smooth scrollbar-none sm:gap-6 ${trackPadding} [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={`relative aspect-3/4 shrink-0 snap-center overflow-hidden rounded-2xl transition-[transform,opacity] duration-500 ${slideWidth} ${
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
              sizes={
                compact
                  ? "(max-width: 640px) 75vw, 280px"
                  : "(max-width: 640px) 85vw, (max-width: 768px) 55vw, 440px"
              }
            />
          </div>
        ))}
      </div>

      <div
        className={`flex items-center justify-center gap-6 px-6 ${compact ? "mt-4" : "mt-8"}`}
      >
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
          {slides.map((slide, index) => (
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
            scrollToIndex(Math.min(activeIndex + 1, slides.length - 1))
          }
          disabled={activeIndex === slides.length - 1}
          aria-label="Next photo"
          className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white/50 hover:bg-white/10 disabled:pointer-events-none disabled:opacity-30"
        >
          →
        </button>
      </div>
    </div>
  );
}
