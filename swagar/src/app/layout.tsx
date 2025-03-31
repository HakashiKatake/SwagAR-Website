// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import React from "react"; // Adjust path if necessary
import DockWrapper from "@/components/DockW"; // Adjust path if necessary

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Swaggar",
  description: "Elevate your fashion sense with Swaggar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative`}>
        {/* Render the SplashCursor on every page */}
     
        {children}
        {/* Render the Dock via the client component */}
        <DockWrapper />
      </body>
    </html>
  );
}
