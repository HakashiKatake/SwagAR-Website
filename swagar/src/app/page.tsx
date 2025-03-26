// app/home/page.tsx
import { HeroPage } from "@/components/HeroPage";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HeroComponent } from "@/components/HeroComponent";
import { ScrollVelocity } from "@/components/ScrollVelocity/ScrollVelocity";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <HeroPage />
      <HeroComponent />

      {/* Section with centered "Features" text */}
      <section className="w-full py-16 flex items-center justify-center">
        <h2 className="text-4xl font-bold">Features</h2>
      </section>

      {/* ScrollVelocity with bottom margin */}
      <section className="mb-20">
        <ScrollVelocity
          texts={[
            "3D Models of Clothes",
            "AI Size Measurement",
            "AR Feature Coming Soon",
          ]}
          velocity={150}
        />
      </section>

      <FeaturesSection />
    </div>
  );
}
