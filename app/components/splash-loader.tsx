"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const MIN_DISPLAY_MS = 600;
const FADE_MS = 400;

export default function SplashLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<"loading" | "fading" | "done">("loading");

  useEffect(() => {
    const img = new window.Image();
    img.src = "/avg_logo.jpg";

    const minDisplay = new Promise<void>((resolve) =>
      setTimeout(resolve, MIN_DISPLAY_MS),
    );

    const imgReady = new Promise<void>((resolve) => {
      if (img.complete) {
        resolve();
        return;
      }
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });

    Promise.all([minDisplay, imgReady]).then(() => setPhase("fading"));
  }, []);

  useEffect(() => {
    if (phase !== "fading") return;

    const timer = setTimeout(() => setPhase("done"), FADE_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <>
      {children}
      {phase !== "done" && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 ${
            phase === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          aria-hidden={phase === "fading"}
        >
          <div className="size-28 animate-spin overflow-hidden rounded-full shadow-[0_0_40px_rgba(220,38,38,0.35)]">
            <Image
              src="/avg_logo.jpg"
              alt="AVG Run Club"
              width={200}
              height={200}
              className="size-full object-cover"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
