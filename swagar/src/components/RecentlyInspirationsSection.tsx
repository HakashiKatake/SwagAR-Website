"use client";

import React, { useState } from "react";
import Image from "next/image";

export function RecentInspirationsSection() {
  const [activeTab, setActiveTab] = useState<"recent" | "inspirations">("recent");

  const handleTabClick = (tab: "recent" | "inspirations") => {
    setActiveTab(tab);
  };

  return (
    <section className="mt-8">
      {/* Tab Buttons */}
      <div className="flex space-x-2 border-b border-gray-700 pb-2 mb-4">
        {/* Recently Tried Button */}
        <button
          className={`flex items-center px-4 py-2 rounded-full text-sm transition-colors
            ${
              activeTab === "recent"
                ? "bg-gray-700 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          onClick={() => handleTabClick("recent")}
        >
          <span className="mr-2">⏱</span>
          Recently Tried
        </button>

        {/* Inspirations Button */}
        <button
          className={`flex items-center px-4 py-2 rounded-full text-sm transition-colors
            ${
              activeTab === "inspirations"
                ? "bg-gray-700 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          onClick={() => handleTabClick("inspirations")}
        >
          <span className="mr-2">✨</span>
          Inspirations
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "recent" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* Replace placeholders with your real "Recently Tried" images */}
          <div className="relative w-full h-52 bg-gray-800 border border-gray-700 rounded">
            <Image
              src="/images/placeholder1.jpg"
              alt="Recently Tried 1"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full h-52 bg-gray-800 border border-gray-700 rounded">
            <Image
              src="/images/placeholder2.jpg"
              alt="Recently Tried 2"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full h-52 bg-gray-800 border border-gray-700 rounded">
            <Image
              src="/images/placeholder3.jpg"
              alt="Recently Tried 3"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full h-52 bg-gray-800 border border-gray-700 rounded">
            <Image
              src="/images/placeholder4.jpg"
              alt="Recently Tried 4"
              fill
              className="object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* Replace placeholders with your real "Inspirations" images */}
          <div className="relative w-full h-52 bg-gray-800 border border-gray-700 rounded">
            <Image
              src="/images/inspiration1.jpg"
              alt="Inspiration 1"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full h-52 bg-gray-800 border border-gray-700 rounded">
            <Image
              src="/images/inspiration2.jpg"
              alt="Inspiration 2"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full h-52 bg-gray-800 border border-gray-700 rounded">
            <Image
              src="/images/inspiration3.jpg"
              alt="Inspiration 3"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full h-52 bg-gray-800 border border-gray-700 rounded">
            <Image
              src="/images/inspiration4.jpg"
              alt="Inspiration 4"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}
    </section>
  );
}
