// app/home/page.tsx (this is a server component)

import {HeroPage} from "@/components/HeroPage"; // note the .client.tsx extension

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroPage />

      {/* Other content */}
      <main className="p-8 bg-white flex-1">
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-lg text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum,
            nisl sit amet convallis aliquam, massa nunc vehicula odio, a elementum lorem
            erat ac eros.
          </p>
        </section>
      </main>
    </div>
  );
}
