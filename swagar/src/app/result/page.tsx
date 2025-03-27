// pages/virtual-try-on/result.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ResultPage() {
  const router = useRouter();
  const [outputImage, setOutputImage] = useState<string | null>(null);

  useEffect(() => {
    const storedImage = localStorage.getItem("outputImage");
    if (storedImage) {
      setOutputImage(storedImage);
    } else {
      router.push("/virtual-try-on");
    }
  }, [router]);

  if (!outputImage) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <p className="text-center">No result found. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Virtual Try-On Result</h1>
      <img src={outputImage} alt="Result" className="w-full border" />
    </div>
  );
}
