import SplashLoader from "./components/splash-loader";
import Hero from "./components/hero";
import ImageCarousel from "./components/image-carousel";
import OriginStory from "./components/origin-story";

export default function Home() {
  return (
    <SplashLoader>
      <main className="bg-black">
        <Hero />
        <ImageCarousel />
        <OriginStory />
      </main>
    </SplashLoader>
  );
}
