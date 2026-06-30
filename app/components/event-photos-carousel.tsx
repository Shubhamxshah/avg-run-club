"use client";

import HorizontalCarousel, {
  type CarouselSlide,
} from "./horizontal-carousel";

export default function EventPhotosCarousel({
  slides,
}: {
  slides: readonly CarouselSlide[];
}) {
  return <HorizontalCarousel slides={slides} compact />;
}
