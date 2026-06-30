import SplashLoader from "./components/splash-loader";
import Hero from "./components/hero";

export default function Home() {
  return (
    <SplashLoader>
      <main className="bg-black">
        <Hero />
      </main>
    </SplashLoader>
  );
}
