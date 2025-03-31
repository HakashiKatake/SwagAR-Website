"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FileUpload } from "@/components/ui/file-upload";
import { Footer } from "@/components/FooterComponent";
import CardDemo from "@/components/cards-demo-2";
import Cookies from "js-cookie";

interface FileWithPreview {
  file: File;
  preview: string;
}

// Add this function near your other utility functions
const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Alternative using localStorage instead of cookies
const saveToStorage = (images: string[]) => {
  try {
    localStorage.setItem('recentImages', JSON.stringify(images));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
};

const loadFromStorage = (): string[] => {
  try {
    const stored = localStorage.getItem('recentImages');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading from localStorage:', e);
    return [];
  }
};

export default function VirtualTryOn() {
  // Person states
  const [useCameraPerson, setUseCameraPerson] = useState(false);
  const [personImage, setPersonImage] = useState<FileWithPreview | null>(null);

  // Garment states
  const [useCameraGarment, setUseCameraGarment] = useState(false);
  const [garmentImage, setGarmentImage] = useState<FileWithPreview | null>(null);

  // Modal / result states
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recent images state (retrieved from localStorage)
  const [recentImages, setRecentImages] = useState<string[]>([]);

  // Camera references
  const personVideoRef = useRef<HTMLVideoElement>(null);
  const garmentVideoRef = useRef<HTMLVideoElement>(null);

  // Retrieve recent images from localStorage on mount
  useEffect(() => {
    const loadAndValidateImages = async () => {
      try {
        const storedImages = loadFromStorage();
        if (storedImages) {
          // Filter out invalid URLs
          const validatedImages = await Promise.all(
            storedImages.map(async (img) => {
              const isValid = await validateImageUrl(img);
              return isValid ? img : null;
            })
          );
          const filteredImages = validatedImages.filter((img): img is string => img !== null);
          
          // Update localStorage with only valid images
          if (filteredImages.length !== storedImages.length) {
            saveToStorage(filteredImages);
          }
          
          setRecentImages(filteredImages);
        }
      } catch (error) {
        console.error('Error loading recent images:', error);
        saveToStorage([]);
        setRecentImages([]);
      }
    };

    loadAndValidateImages();
  }, []);

  // Validation logic
  const validateImage = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Please upload JPEG, PNG, or WebP images only");
    }
    if (file.size > maxSize) {
      throw new Error("Image size should be less than 5MB");
    }
  };

  // Called by FileUpload
  const handleFileUpload = (files: File[], type: "person" | "garment") => {
    setError(null);
    if (!files.length) return;
    const file = files[0];
    try {
      validateImage(file);
      const preview = URL.createObjectURL(file);
      if (type === "person") {
        setPersonImage({ file, preview });
      } else {
        setGarmentImage({ file, preview });
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Start camera
  const startCamera = async (type: "person" | "garment") => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      if (type === "person") {
        if (personVideoRef.current) {
          personVideoRef.current.srcObject = stream;
          personVideoRef.current.play();
        }
      } else {
        if (garmentVideoRef.current) {
          garmentVideoRef.current.srcObject = stream;
          garmentVideoRef.current.play();
        }
      }
    } catch (err: any) {
      setError("Unable to access camera. Please check your permissions.");
    }
  };

  // Stop camera
  const stopCamera = (type: "person" | "garment") => {
    if (type === "person" && personVideoRef.current?.srcObject) {
      (personVideoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
      personVideoRef.current.srcObject = null;
    } else if (type === "garment" && garmentVideoRef.current?.srcObject) {
      (garmentVideoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
      garmentVideoRef.current.srcObject = null;
    }
  };

  // Capture camera frame
  const captureImage = (type: "person" | "garment") => {
    const videoEl =
      type === "person" ? personVideoRef.current : garmentVideoRef.current;
    if (!videoEl) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/jpeg");
    const file = dataURLtoFile(dataURL, `${type}-capture.jpg`);
    try {
      validateImage(file);
      const preview = URL.createObjectURL(file);
      if (type === "person") {
        setPersonImage({ file, preview });
      } else {
        setGarmentImage({ file, preview });
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Helper: dataURL -> File
  function dataURLtoFile(dataurl: string, filename: string) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera("person");
      stopCamera("garment");
    };
  }, []);

  // Submit form: sends images to API, then stores result in localStorage and updates recentImages state
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResultImage(null);
    if (!personImage?.file || !garmentImage?.file) {
      setError("Please upload both images or capture them from camera.");
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
        // Show the result in the modal
        setResultImage(data.data);

        // Load existing images first
        let currentImages: string[] = [];
        try {
          currentImages = loadFromStorage();
        } catch (e) {
          console.error("Error parsing stored images:", e);
          currentImages = [];
        }

        // Add new image and limit to 5
        const updatedImages = [data.data, ...currentImages].slice(0, 5);

        // Store in localStorage
        saveToStorage(updatedImages);

        setRecentImages(updatedImages);
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

  // Close the modal
  const handleCloseModal = () => {
    setResultImage(null);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Virtual Try-On</h1>
      {error && (
        <div className="bg-red-800 border border-red-600 text-red-100 px-4 py-3 rounded mb-4 max-w-xl text-center">
          {error}
        </div>
      )}
      {/* Upload/Camera section */}
      <form
        onSubmit={handleSubmit}
        className="space-y-8 w-full max-w-2xl flex flex-col items-center"
      >
        {/* Person Section */}
        <div className="w-full flex flex-col items-center">
          <label className="block font-medium mb-2 text-center">
            Person Image:
          </label>
          <div className="flex space-x-2 mb-2">
            <button
              type="button"
              className={`px-4 py-2 rounded font-medium ${
                useCameraPerson
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => {
                setUseCameraPerson(true);
                stopCamera("person");
                startCamera("person");
              }}
            >
              Live Camera
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded font-medium ${
                !useCameraPerson
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => {
                setUseCameraPerson(false);
                stopCamera("person");
              }}
            >
              Upload Picture
            </button>
          </div>
          {useCameraPerson ? (
            <div className="flex flex-col items-center">
              <video
                ref={personVideoRef}
                className="w-48 h-64 border border-gray-700 rounded bg-black"
                autoPlay
                muted
              ></video>
              <button
                type="button"
                onClick={() => captureImage("person")}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Capture
              </button>
            </div>
          ) : (
            <FileUpload
              onChange={(files) => handleFileUpload(files, "person")}
              className="bg-gray-800 border border-gray-600 w-full max-w-sm"
            />
          )}
          {personImage?.preview && (
            <div className="mt-2 relative h-64 w-48 border border-gray-700 rounded overflow-hidden">
              <Image
                src={personImage.preview}
                alt="Person Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
        {/* Garment Section */}
        <div className="w-full flex flex-col items-center">
          <label className="block font-medium mb-2 text-center">
            Garment Image:
          </label>
          <div className="flex space-x-2 mb-2">
            <button
              type="button"
              className={`px-4 py-2 rounded font-medium ${
                useCameraGarment
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => {
                setUseCameraGarment(true);
                stopCamera("garment");
                startCamera("garment");
              }}
            >
              Live Camera
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded font-medium ${
                !useCameraGarment
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => {
                setUseCameraGarment(false);
                stopCamera("garment");
              }}
            >
              Upload Picture
            </button>
          </div>
          {useCameraGarment ? (
            <div className="flex flex-col items-center">
              <video
                ref={garmentVideoRef}
                className="w-48 h-64 border border-gray-700 rounded bg-black"
                autoPlay
                muted
              ></video>
              <button
                type="button"
                onClick={() => captureImage("garment")}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Capture
              </button>
            </div>
          ) : (
            <FileUpload
              onChange={(files) => handleFileUpload(files, "garment")}
              className="bg-gray-800 border border-gray-600 w-full max-w-sm"
            />
          )}
          {garmentImage?.preview && (
            <div className="mt-2 relative h-64 w-48 border border-gray-700 rounded overflow-hidden">
              <Image
                src={garmentImage.preview}
                alt="Garment Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full max-w-sm px-4 py-2 rounded font-medium transition-colors ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Try On"
          )}
        </button>
      </form>
      {/* Modal for result */}
      {resultImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative bg-neutral-900 text-white max-w-xl w-full rounded-lg shadow-lg p-4">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-300 hover:text-white"
            >
              <span className="text-2xl">&times;</span>
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              Your Virtual Try-On
            </h2>
            <div className="relative w-full h-[500px] border border-gray-700 rounded mb-4 overflow-hidden">
              <Image
                src={resultImage}
                alt="Try-on Result"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-400 mb-4 text-center">
              Generated on {new Date().toLocaleDateString()}
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">
                Save
              </button>
              <button className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500">
                Share
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Recently Tried / Inspirations Section using CardDemo with props */}
      <RecentlyInspirationsSection recentImages={recentImages} />
      <Footer />
    </div>
  );
}

/** 
 * Inline component for "Recently Tried" and "Inspirations" tabs, using CardDemo with props.
 * Only title, description, and backgroundImage are passed.
 */
function RecentlyInspirationsSection({
  recentImages,
}: {
  recentImages: string[];
}) {
  const [activeTab, setActiveTab] = useState<"recent" | "inspirations">("recent");

  const handleTabClick = (tab: "recent" | "inspirations") => {
    setActiveTab(tab);
  };

  // Demo card data if no recent images are stored:
  const demoRecentCards = [
    {
      title: "Fresh Look",
      description: "Explore our latest trends.",
      backgroundImage:
        "https://images.unsplash.com/photo-1544077960-604201fe74bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80",
    },
    {
      title: "Urban Vibes",
      description: "Modern styles for city life.",
      backgroundImage:
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1650&q=80",
    },
    {
      title: "Classic Elegance",
      description: "Timeless designs redefined.",
      backgroundImage:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1650&q=80",
    },
    {
      title: "Bold Statements",
      description: "Make your mark with standout styles.",
      backgroundImage:
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1650&q=80",
    },
  ];

  // If there are stored images, create card data from them; otherwise, use demo data.
  const recentCards =
    recentImages && recentImages.length > 0
      ? recentImages.map((img: string, idx: number) => ({
          title: `Try ${idx + 1}`,
          description: "Your recent try-on image.",
          backgroundImage: img,
        }))
      : demoRecentCards;

  const inspirationCards = [
    {
      title: "Future Trends",
      description: "Innovative styles for tomorrow.",
      backgroundImage:
        "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1650&q=80",
    },
    {
      title: "Street Wear",
      description: "Casual looks with an edge.",
      backgroundImage:
        "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1650&q=80",
    },
    {
      title: "High Fashion",
      description: "Luxury designs for discerning tastes.",
      backgroundImage:
        "https://images.unsplash.com/photo-1489987707025-afc1f226d198?auto=format&fit=crop&w=1650&q=80",
    },
    {
      title: "Eco Chic",
      description: "Sustainable fashion that looks great.",
      backgroundImage:
        "https://images.unsplash.com/photo-1520975911061-40d77079a3e6?auto=format&fit=crop&w=1650&q=80",
    },
  ];

  return (
    <section className="mt-10 w-full max-w-4xl mx-auto text-center">
      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-700 pb-2 mb-4 justify-center">
        <button
          className={`flex items-center px-4 py-2 rounded-full text-sm transition-colors ${
            activeTab === "recent"
              ? "bg-gray-700 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
          onClick={() => handleTabClick("recent")}
        >
          <span className="mr-2">⏱</span>
          Recently Tried
        </button>
        <button
          className={`flex items-center px-4 py-2 rounded-full text-sm transition-colors ${
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
      {activeTab === "recent" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {recentCards.map((card, idx) => (
            <CardDemo
              key={idx}
              backgroundImage={card.backgroundImage}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {inspirationCards.map((card, idx) => (
            <CardDemo
              key={idx}
              backgroundImage={card.backgroundImage}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      )}
    </section>
  );
}
