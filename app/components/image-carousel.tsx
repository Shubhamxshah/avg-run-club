import HorizontalCarousel from "./horizontal-carousel";

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

      <HorizontalCarousel slides={SLIDES} />
    </section>
  );
}
