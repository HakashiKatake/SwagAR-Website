"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";

interface FileWithPreview {
  file: File;
  preview: string;
}

export default function VirtualTryOn() {
  const [personImage, setPersonImage] = useState<FileWithPreview | null>(null);
  const [garmentImage, setGarmentImage] = useState<FileWithPreview | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateImage = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      throw new Error('Please upload JPEG, PNG, or WebP images only');
    }
    if (file.size > maxSize) {
      throw new Error('Image size should be less than 5MB');
    }
  };

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    setImage: (value: FileWithPreview | null) => void
  ) => {
    try {
      setError(null);
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        validateImage(file);
        setImage({
          file,
          preview: URL.createObjectURL(file),
        });
      }
    } catch (err: any) {
      setError(err.message);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setResultImage(null);

    if (!personImage?.file || !garmentImage?.file) {
      setError("Please upload both images.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("person", personImage.file);
      formData.append("garment", garmentImage.file);

      const response = await fetch("/api/tryon", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResultImage(data.data);
      } else {
        setError(data.error || "An error occurred while processing the images");
      }
    } catch (error: any) {
      console.error("Error in fetch:", error);
      setError(error.message || "An error occurred while processing the request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Virtual Try-On</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Person Image:</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleImageChange(e, setPersonImage)}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {personImage?.preview && (
                <div className="mt-2 relative h-64 w-48 border rounded overflow-hidden">
                  <Image
                    src={personImage.preview}
                    alt="Person Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block font-medium mb-2">Garment Image:</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleImageChange(e, setGarmentImage)}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {garmentImage?.preview && (
                <div className="mt-2 relative h-64 w-48 border rounded overflow-hidden">
                  <Image
                    src={garmentImage.preview}
                    alt="Garment Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 rounded font-medium transition-colors
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Try On'}
          </button>
        </form>

        <div className="border-l pl-8">
          <h2 className="text-xl font-semibold mb-4">Result</h2>
          {resultImage ? (
            <div className="relative h-[600px] w-full border rounded overflow-hidden">
              <Image
                src={resultImage}
                alt="Try-on Result"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="h-[600px] w-full border rounded flex items-center justify-center text-gray-500">
              Result will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}