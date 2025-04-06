import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["aceternity.com", "images.unsplash.com", "images.pexels.com", "static.vecteezy.com", "i.pinimg.com", "assets.aceternity.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "levihsu-ootdiffusion.hf.space",
        pathname: "/file=/tmp/gradio/**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
