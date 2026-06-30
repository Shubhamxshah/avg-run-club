import SplashLoader from "./components/splash-loader";
import Hero from "./components/hero";
import ImageCarousel from "./components/image-carousel";

export default function Home() {
  return (
    <SplashLoader>
      <main className="bg-black">
        <Hero />
        <ImageCarousel />
      </main>
    </SplashLoader>
  );
}
