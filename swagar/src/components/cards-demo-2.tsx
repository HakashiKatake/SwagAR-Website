"use client";
import { cn } from "@/lib/utils";
import React from "react";

interface CardDemoProps {
  backgroundImage?: string;
  title?: string;
  description?: string;
  className?: string;
}

export default function CardDemo({
  backgroundImage = "https://images.unsplash.com/photo-1544077960-604201fe74bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80",
  title = "Card Title",
  description = "Some description...",
  className = "",
}: CardDemoProps) {
  return (
    <div className={cn("max-w-xs w-full group/card", className)}>
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl max-w-sm mx-auto flex flex-col justify-end p-4",
          // Use the backgroundImage prop here:
          `bg-[url('${backgroundImage}')] bg-cover bg-center`
        )}
      >
        {/* Optional overlay on hover */}
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>

        {/* Text content */}
        <div className="relative z-10 text-left">
          <h1 className="font-bold text-xl md:text-2xl text-gray-50 mb-2">
            {title}
          </h1>
          <p className="font-normal text-sm text-gray-50">{description}</p>
        </div>
      </div>
    </div>
  );
}
