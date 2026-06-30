import Image from "next/image";

export default function OriginStory() {
  return (
    <section
      id="our-story"
      aria-labelledby="our-story-heading"
      className="bg-black px-6 py-16 md:py-24"
    >
      <div className="mx-auto max-w-3xl">
        <p
          id="our-story-heading"
          className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.35em] text-[#e8192c]"
        >
          Origin Story
        </p>

        <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
          <Image
            src="/story.jpg"
            alt="Our Story — AVG Run Club began on 20 May, 2026 in Bharuch. Run far, not fast."
            width={1439}
            height={1918}
            className="h-auto w-full"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      </div>
    </section>
  );
}
