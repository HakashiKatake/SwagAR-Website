"use client";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";

export function HeroComponent() {
  const images = [
    "https://i.pinimg.com/736x/ca/f5/45/caf54519e5183e454f641a83ba06257f.jpg",
    "https://i.pinimg.com/736x/1f/0b/61/1f0b6175df77b8bac599db3ad62cb2f4.jpg",
    "https://i.pinimg.com/736x/56/fb/82/56fb82efad54cf00947f814f7a3dfced.jpg",
    "https://i.pinimg.com/736x/ff/5a/53/ff5a537b3a10bbfb2d75c0e82f951be0.jpg",
    "https://i.pinimg.com/736x/46/5f/da/465fdae0ede26b8728cc8291ecd93195.jpg",
    "https://i.pinimg.com/736x/46/5f/da/465fdae0ede26b8728cc8291ecd93195.jpg",
    "https://i.pinimg.com/736x/ff/5a/53/ff5a537b3a10bbfb2d75c0e82f951be0.jpg",
    "https://i.pinimg.com/736x/09/35/30/0935305b6c80bcb8028829c38a162dd8.jpg",
    "https://i.pinimg.com/736x/1f/0b/61/1f0b6175df77b8bac599db3ad62cb2f4.jpg",
    "https://i.pinimg.com/736x/ca/f5/45/caf54519e5183e454f641a83ba06257f.jpg",
    "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1625698311031-f0dd15be5144?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1618354691229-88d47f285158?q=80&w=2231&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1499971856191-1a420a42b498?q=80&w=2658&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.pexels.com/photos/1176618/pexels-photo-1176618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/3353621/pexels-photo-3353621.jpeg",
    "https://images.pexels.com/photos/3353621/pexels-photo-3353621.jpeg",
    "https://images.pexels.com/photos/3089830/pexels-photo-3089830.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://static.vecteezy.com/system/resources/previews/050/519/660/non_2x/a-hooded-man-is-standing-in-front-of-a-dark-background-free-photo.jpeg",
    "https://static.vecteezy.com/system/resources/previews/049/231/631/non_2x/black-hoodie-with-minimalist-elements-displayed-in-productgraphy-photo.jpg",
    "https://static.vecteezy.com/system/resources/previews/049/232/282/non_2x/geometric-design-on-a-black-hoodie-free-photo.jpg",
    "https://i.pinimg.com/736x/b7/3e/fa/b73efa04ee46aece89a92705c12760e2.jpg",
    "https://i.pinimg.com/736x/44/ea/8d/44ea8d2d8a34239ba162762c591352c9.jpg",
    "https://i.pinimg.com/736x/85/2a/16/852a165c5558664d46c356dcfbc067e8.jpg",

  ];
  return (
    <div className="relative mx-auto my-10 flex h-screen w-full max-w-7xl flex-col items-center justify-center overflow-hidden rounded-3xl">
      <h2 className="relative z-20 mx-auto max-w-4xl text-center text-2xl font-bold text-balance text-white md:text-4xl lg:text-6xl">
        Elevate your{" "}
        <span className="relative z-20 inline-block rounded-xl bg-blue-500/40 px-4 py-1 text-white underline decoration-sky-500 decoration-[6px] underline-offset-[16px] backdrop-blur-sm">
          Fashion
        </span>{" "}
        Sense.
      </h2>
      <p className="relative z-20 mx-auto max-w-2xl py-8 text-center text-sm text-neutral-200 md:text-base">
        Just some clicks away
      </p>

      <div className="relative z-20 flex flex-wrap items-center justify-center gap-4 pt-4">
        <button className="rounded-md bg-sky-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-black focus:outline-none">
          Get Started
        </button>
        <button className="rounded-md border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black focus:outline-none">
          Learn More
        </button>
      </div>

      {/* overlay */}
      <div className="absolute inset-0 z-10 h-full w-full bg-black/60 dark:bg-black/80" />
      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 h-full w-full"
        images={images}
      />
    </div>
  );
}
