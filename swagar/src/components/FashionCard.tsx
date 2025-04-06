"use client";
import React, { useState } from "react";

interface FashionCardProps {
  imageUrl: string;
  title: string;
  description: string;
  onClick?: () => void;
  isClickable?: boolean;
  isLoading?: boolean;
}

const FashionCard: React.FC<FashionCardProps> = ({
  imageUrl,
  title,
  description,
  onClick,
  isClickable = false,
  isLoading = false
}) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div 
      className={`relative rounded-lg overflow-hidden h-96 w-full shadow-lg ${
        isClickable ? 'cursor-pointer transform transition-transform hover:scale-105' : ''
      }`}
      onClick={isClickable && onClick ? onClick : undefined}
    >
      {/* Image container with fallback */}
      <div className="absolute inset-0 bg-gray-900">
        {!imageError ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-gray-400 mb-2">Image unavailable</div>
              <div className="text-gray-500 text-sm">{title}</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-bold text-xl text-white mb-1">{title}</h3>
        <p className="text-gray-200 text-sm">{description}</p>
      </div>
      
      {/* Clickable overlay indicator */}
      {isClickable && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity">
          <span className="bg-blue-600 text-white px-3 py-2 rounded text-sm opacity-0 hover:opacity-100 transition-opacity">
            Use this garment
          </span>
        </div>
      )}
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <svg
            className="animate-spin h-10 w-10 text-white"
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

export default FashionCard;