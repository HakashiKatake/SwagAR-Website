// app/home/page.tsx
import { HeroPage } from "@/components/HeroPage";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HeroComponent } from "@/components/HeroComponent";
import { ScrollVelocity } from "@/components/ScrollVelocity/ScrollVelocity";
import { Footer } from "@/components/FooterComponent";
import AboutMenu from "@/components/AboutMenu";
import { AutoPlay } from "@/components/AutoPlay";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <HeroPage />

      <section className="w-full py-16 flex items-center justify-center">
        <h2 className="text-4xl font-bold">About Us</h2>
      </section>
      <AboutMenu />
      <AutoPlay />
      

      {/* Section with centered "Features" text */}
      <section className="w-full py-16 flex items-center justify-center">
        <h2 className="text-4xl font-bold">Features</h2>
      </section>

      {/* ScrollVelocity with bottom margin */}
      <section>
        <ScrollVelocity
          texts={[
            "3D Models of Clothes",
            "Try on clothes virtually",
          
          ]}
          velocity={150}
        />
      </section>

      <FeaturesSection />

      <section className="w-full py-16 flex items-center justify-center">
        <h2 className="text-4xl font-bold">Join the club!</h2>
      </section>
      <HeroComponent />
      <Footer />
    </div>
  );
}
