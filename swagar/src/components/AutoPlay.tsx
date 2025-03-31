import React from "react";
import { Compare } from "@/components/ui/compare";

export function AutoPlay() {
  return (
    <div className="w-3/4 h-[60vh] px-1 md:px-8 flex items-center justify-center [perspective:800px] [transform-style:preserve-3d]">
      <div
        style={{
          transform: "rotateX(15deg) translateZ(80px)",
        }}
        className="p-1 md:p-4 border rounded-3xl dark:bg-neutral-900 dark:border-neutral-800 mx-auto w-3/4 h-1/2 md:h-3/4"
      >
        <Compare
          firstImage="https://i.pinimg.com/736x/50/1e/2c/501e2cde12fb5a4e93d4947a957542bc.jpg"
          secondImage="https://i.pinimg.com/736x/36/79/6f/36796f6d7312080e18b95f5cb88a2aa9.jpg"
          firstImageClassName="object-cover object-left-top w-full"
          secondImageClassname="object-cover object-left-top w-full"
          className="w-full h-full rounded-[22px] md:rounded-lg"
          slideMode="hover"
          autoplay={true}
        />
      </div>
    </div>
  );
}
