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

interface Card {
  title: string;
  description: string;
  backgroundImage: string;
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

// AI Suggestions for the modal view
const aiSuggestions = [
  "You look great in this outfit! The color really complements your skin tone.",
  "This garment fits your body shape perfectly. The style suits you well!",
  "This is a fantastic match! The design enhances your natural features.",
  "This look really works for you. The pattern and cut are very flattering.",
  "The silhouette of this garment works wonderfully with your frame.",
  "This style brings out your best features. Consider trying similar designs!",
  "The color palette of this outfit really makes you stand out.",
  "This combination is very balanced and proportional for your body type.",
  "This look gives you a polished appearance. Perfect for your style profile!",
  "The fit is excellent and the style harmonizes well with your overall look."
];

// Styling suggestions
const stylingSuggestions = [
  "Try pairing this with some minimalist accessories for a more elegant look.",
  "This would look great with a statement necklace or bold earrings.",
  "Consider layering with a light jacket or cardigan for added dimension.",
  "This outfit would pair well with neutral-toned footwear.",
  "Add a belt to define the waist and create more structure.",
  "For a casual look, roll up the sleeves and add some bangles or a watch.",
  "A simple scarf could add a pop of color to complete this look.",
  "This would work well with both casual and formal footwear depending on the occasion.",
  "Consider adding a hat or headband to complement this outfit.",
  "Try contrasting textures with your accessories to add visual interest."
];

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
  
  // AI suggestion states
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [stylingSuggestion, setStylingSuggestion] = useState<string>("");
  
  // Loading state for inspiration image loading
  const [loadingInspirationImage, setLoadingInspirationImage] = useState(false);
  
  // State for Save and Share buttons
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  // Recent images state (retrieved from localStorage)
  const [recentImages, setRecentImages] = useState<string[]>([]);

  // Camera references
  const personVideoRef = useRef<HTMLVideoElement>(null);
  const garmentVideoRef = useRef<HTMLVideoElement>(null);

  // References for file input
  const personFileInputRef = useRef<HTMLInputElement>(null);
  const garmentFileInputRef = useRef<HTMLInputElement>(null);

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

  // Clean up object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (personImage?.preview) URL.revokeObjectURL(personImage.preview);
      if (garmentImage?.preview) URL.revokeObjectURL(garmentImage.preview);
    };
  }, [personImage?.preview, garmentImage?.preview]);
  
  // Reset share message after a delay
  useEffect(() => {
    if (shareMessage) {
      const timer = setTimeout(() => {
        setShareMessage(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [shareMessage]);

  // Generate random AI suggestions when resultImage changes
  useEffect(() => {
    if (resultImage) {
      const randomAiSuggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
      const randomStylingSuggestion = stylingSuggestions[Math.floor(Math.random() * stylingSuggestions.length)];
      setAiSuggestion(randomAiSuggestion);
      setStylingSuggestion(randomStylingSuggestion);
    }
  }, [resultImage]);

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
      // Revoke previous object URL if it exists
      if (type === "person" && personImage?.preview) {
        URL.revokeObjectURL(personImage.preview);
      } else if (type === "garment" && garmentImage?.preview) {
        URL.revokeObjectURL(garmentImage.preview);
      }
      
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

  // Function to download image from URL and convert to File
  const fetchImageAsFile = async (imageUrl: string, fileName: string): Promise<File | null> => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      const blob = await response.blob();
      // Get file extension from the URL or response content type
      const fileExtension = response.headers.get('content-type')?.split('/')[1] || 'jpeg';
      return new File([blob], `${fileName}.${fileExtension}`, { type: blob.type });
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  // Function to handle saving the image
  const handleSaveImage = async () => {
    if (!resultImage || isSaving) return;
    
    setIsSaving(true);
    try {
      // Fetch the image and create a blob
      const response = await fetch(resultImage);
      const blob = await response.blob();
      
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `virtual-tryon-${new Date().getTime()}.jpg`;
      
      // Append to the body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Error downloading image:", err);
      setError("Failed to download image. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Function to handle sharing the image
  const handleShareImage = async () => {
    if (!resultImage || isSharing) return;
    
    setIsSharing(true);
    
    try {
      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare) {
        const imageFile = await fetchImageAsFile(resultImage, 'virtual-tryon');
        
        if (imageFile) {
          const shareData = {
            title: 'My Virtual Try-On',
            text: 'Check out my virtual try-on result!',
            files: [imageFile]
          };
          
          // Try to share with files
          if (navigator.canShare(shareData)) {
            await navigator.share(shareData);
            return;
          }
        }
        
        // Fallback to sharing link only
        await navigator.share({
          title: 'My Virtual Try-On',
          text: 'Check out my virtual try-on result!',
          url: resultImage
        });
      } else {
        // Fallback for browsers without Web Share API: copy URL to clipboard
        await navigator.clipboard.writeText(resultImage);
        setShareMessage("Image URL copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing image:", err);
      // If we can't share or copy to clipboard, show a message
      setShareMessage(
        navigator.clipboard 
          ? "Failed to share. Image URL copied to clipboard instead."
          : "Failed to share. Please try again."
      );
    } finally {
      setIsSharing(false);
    }
  };

  // Function to handle inspiration image selection
  const handleInspirationSelect = async (imageUrl: string) => {
    if (loadingInspirationImage) return; // Prevent multiple clicks while loading
    
    setError(null);
    setLoadingInspirationImage(true);
    
    try {
      // Disable camera mode if active
      if (useCameraGarment) {
        stopCamera("garment");
        setUseCameraGarment(false);
      }
      
      // Download and process the image
      const file = await fetchImageAsFile(imageUrl, `inspiration-${Date.now()}`);
      
      if (!file) {
        throw new Error("Failed to load inspiration image");
      }
      
      validateImage(file);
      // Revoke previous object URL if it exists
      if (garmentImage?.preview) {
        URL.revokeObjectURL(garmentImage.preview);
      }
      const preview = URL.createObjectURL(file);
      
      // Set the garment image
      setGarmentImage({ file, preview });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingInspirationImage(false);
    }
  };

  // Handle change image button click
  const handleChangeImage = (type: "person" | "garment") => {
    if (type === "person") {
      // Clean up URL before removing the image
      if (personImage?.preview) {
        URL.revokeObjectURL(personImage.preview);
      }
      setPersonImage(null);
      if (personFileInputRef.current) {
        personFileInputRef.current.value = '';
        personFileInputRef.current.click();
      }
    } else {
      // Clean up URL before removing the image
      if (garmentImage?.preview) {
        URL.revokeObjectURL(garmentImage.preview);
      }
      setGarmentImage(null);
      if (garmentFileInputRef.current) {
        garmentFileInputRef.current.value = '';
        garmentFileInputRef.current.click();
      }
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
      // Revoke previous object URL if it exists
      if (type === "person" && personImage?.preview) {
        URL.revokeObjectURL(personImage.preview);
      } else if (type === "garment" && garmentImage?.preview) {
        URL.revokeObjectURL(garmentImage.preview);
      }
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
    setShareMessage(null);
    setAiSuggestion("");
    setStylingSuggestion("");
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Virtual Try-On</h1>
      <h2 className="text-xl mb-4 text-center">
        Note: This is a demo version. The results may not be perfect.
        If it gives an error, just retry again.
      </h2>
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
            <div className="bg-gray-800 border border-gray-600 w-full max-w-sm rounded p-4">
              {personImage?.preview ? (
                <div className="flex flex-col items-center">
                  <div className="relative h-64 w-48 border border-gray-700 rounded overflow-hidden mb-3">
                    {/* Using regular img tag instead of Next.js Image for local object URLs */}
                    <img
                      src={personImage.preview}
                      alt="Person Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChangeImage("person")}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Change Image
                  </button>
                  <input
                    ref={personFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFileUpload([e.target.files[0]], "person");
                      }
                    }}
                  />
                </div>
              ) : (
                <FileUpload
                  onChange={(files) => handleFileUpload(files, "person")}
                  className="w-full"
                />
              )}
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
            <div className="bg-gray-800 border border-gray-600 w-full max-w-sm rounded p-4">
              {garmentImage?.preview ? (
                <div className="flex flex-col items-center">
                  <div className="relative h-64 w-48 border border-gray-700 rounded overflow-hidden mb-3">
                    {/* Using regular img tag instead of Next.js Image for local object URLs */}
                    <img
                      src={garmentImage.preview}
                      alt="Garment Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChangeImage("garment")}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Change Image
                  </button>
                  <input
                    ref={garmentFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFileUpload([e.target.files[0]], "garment");
                      }
                    }}
                  />
                </div>
              ) : (
                <FileUpload
                  onChange={(files) => handleFileUpload(files, "garment")}
                  className="w-full"
                />
              )}
            </div>
          )}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || loadingInspirationImage}
          className={`w-full max-w-sm px-4 py-2 rounded font-medium transition-colors ${
            loading || loadingInspirationImage
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading || loadingInspirationImage ? (
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
              {loading ? "Processing..." : "Loading image..."}
            </span>
          ) : (
            "Try On"
          )}
        </button>
      </form>
      {/* Modal for result */}
      {resultImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative bg-neutral-900 text-white max-w-xl w-full rounded-lg shadow-lg p-4 flex flex-col max-h-[90vh]">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-300 hover:text-white z-10"
            >
              <span className="text-2xl">&times;</span>
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              Your Virtual Try-On
            </h2>
            
            {/* Scrollable content area */}
            <div className="overflow-y-auto flex-grow pr-2 pb-20">
              <div className="relative w-full h-[400px] border border-gray-700 rounded mb-4">
                {/* For remote URLs, Next.js Image is fine */}
                <Image
                  src={resultImage}
                  alt="Try-on Result"
                  fill
                  className="object-contain"
                />
              </div>
              
              <p className="text-sm text-gray-400 mb-2 text-center">
                Generated on {new Date().toLocaleDateString()}
              </p>
              
              {/* AI Suggestion Section */}
              <div className="mb-4 p-4 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg">
                <div className="flex items-start">
                  <div className="bg-blue-600 p-1 rounded-full mr-2 flex-shrink-0 mt-1">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-white" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M13 10V3L4 14h7v7l9-11h-7z" 
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-100">AI Style Assistant</h3>
                    <p className="text-blue-50 mt-1">"{aiSuggestion}"</p>
                    <p className="mt-2 text-blue-100 font-medium">Styling Tip:</p>
                    <p className="text-blue-50">{stylingSuggestion}</p>
                  </div>
                </div>
              </div>
              
              {/* Share message notification */}
              {shareMessage && (
                <div className="bg-blue-900 text-blue-100 px-3 py-2 rounded-md mb-4 text-center text-sm">
                  {shareMessage}
                </div>
              )}
            </div>
            
            {/* Fixed button bar at bottom of modal */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-neutral-900 border-t border-gray-800 flex items-center justify-center space-x-4">
              <button 
                onClick={handleSaveImage}
                disabled={isSaving}
                className={`px-4 py-2 rounded font-medium ${
                  isSaving ? "bg-gray-500 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-600"
                } flex items-center justify-center min-w-[80px]`}
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving
                  </span>
                ) : "Save"}
              </button>
              <button 
                onClick={handleShareImage}
                disabled={isSharing}
                className={`px-4 py-2 rounded font-medium ${
                  isSharing ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
                } flex items-center justify-center min-w-[80px]`}
              >
                {isSharing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sharing
                  </span>
                ) : "Share"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Recently Tried / Inspirations Section using CardDemo with props */}
      <RecentlyInspirationsSection 
        recentImages={recentImages} 
        onInspirationSelect={handleInspirationSelect}
        loadingInspirationImage={loadingInspirationImage}
      />
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
  onInspirationSelect,
  loadingInspirationImage
}: {
  recentImages: string[];
  onInspirationSelect: (imageUrl: string) => Promise<void>;
  loadingInspirationImage: boolean;
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
        "https://levihsu-ootdiffusion.hf.space/file=/tmp/gradio/44aee6b576cae51eeb979311306375b56b7e0d8b/02305_00.jpg",
    },
    {
      title: "Street Wear",
      description: "Casual looks with an edge.",
      backgroundImage:
        "https://levihsu-ootdiffusion.hf.space/file=/tmp/gradio/e28fc56e21c31a3b88cecfaa12d05f4231fe67c9/02015_00.jpg",
    },
    {
      title: "High Fashion",
      description: "Luxury designs for discerning tastes.",
      backgroundImage:
        "https://levihsu-ootdiffusion.hf.space/file=/tmp/gradio/31c958b21068795c7a90552fc6dc123282b4c7ab/00126_00.jpg",
    },
    {
      title: "Eco Chic",
      description: "Sustainable fashion that looks great.",
      backgroundImage:
        "https://levihsu-ootdiffusion.hf.space/file=/tmp/gradio/f42b2bf4352df51248c5d25a0244b783026b76b8/06123_00.jpg",
    },
  ];

  // Clickable card wrapper component with proper typing
  const ClickableCardDemo = ({ 
    card, 
    onClick, 
    isClickable = false, 
    isLoading = false 
  }: { 
    card: Card; 
    onClick: (imageUrl: string) => void; 
    isClickable?: boolean; 
    isLoading?: boolean;
  }) => {
    return (
      <div 
        className={`relative ${isClickable ? 'cursor-pointer transform transition-transform hover:scale-105' : ''}`} 
        onClick={isClickable ? () => onClick(card.backgroundImage) : undefined}
      >
        <CardDemo
          backgroundImage={card.backgroundImage}
          title={card.title}
          description={card.description}
        />
        {isClickable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity">
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs opacity-0 hover:opacity-100">
              Use this garment
            </span>
          </div>
        )}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <svg
              className="animate-spin h-8 w-8 text-white"
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
          </div>
        )}
      </div>
    );
  };

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
        
      </div>
      
      {activeTab === "recent" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {recentCards.map((card, idx) => (
            <ClickableCardDemo
              key={idx}
              card={card}
              onClick={() => {}}
              isClickable={false}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {inspirationCards.map((card, idx) => (
            <ClickableCardDemo
              key={idx}
              card={card}
              onClick={onInspirationSelect}
              isClickable={true}
              isLoading={loadingInspirationImage}
            />
          ))}
        </div>
      )}
      
      {activeTab === "inspirations" && (
        <p className="mt-4 text-gray-400 text-sm">
          Click on any garment above to use it in the try-on
        </p>
      )}
    </section>
  );
}