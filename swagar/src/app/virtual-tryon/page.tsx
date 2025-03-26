"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function VirtualTryOn() {
  const router = useRouter();
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [garmentImage, setGarmentImage] = useState<File | null>(null);
  const [personPreview, setPersonPreview] = useState<string | null>(null);
  const [garmentPreview, setGarmentPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePersonChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPersonImage(file);
      setPersonPreview(URL.createObjectURL(file));
    }
  };

  const handleGarmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setGarmentImage(file);
      setGarmentPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!personImage || !garmentImage) {
      alert("Please upload both images.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("person", personImage);
    formData.append("garment", garmentImage);

    try {
      const response = await fetch("/api/tryon", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Server response:", data);
      if (data.success) {
        // Save result image to localStorage and navigate to the result page
        localStorage.setItem("outputImage", data.data);
        router.push("/virtual-tryon/result");
      } else {
        alert("Server error: " + data.error);
      }
    } catch (error) {
      console.error("Error in fetch:", error);
      alert("An error occurred.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Virtual Try-On</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Person Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePersonChange}
            className="border p-1"
          />
          {personPreview && (
            <div className="mt-2">
              <img
                src={personPreview}
                alt="Person Preview"
                className="w-48 border"
              />
            </div>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1">Garment Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleGarmentChange}
            className="border p-1"
          />
          {garmentPreview && (
            <div className="mt-2">
              <img
                src={garmentPreview}
                alt="Garment Preview"
                className="w-48 border"
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {loading ? "Processing..." : "Try On"}
        </button>
      </form>
    </div>
  );
}
