'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  headerStyle: string;
  backgroundImage?: string;
}

interface WeddingCoverProps {
  brideName: string;
  groomName: string;
  date: Date | string;
  guestName?: string;
  coverImage?: string;
  onOpen: () => void;
  themeConfig?: ThemeConfig;
}

export default function WeddingCover({ 
  brideName, 
  groomName, 
  date, 
  guestName = 'Dear Guest', 
  coverImage,
  onOpen,
  themeConfig
}: WeddingCoverProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Use provided theme config or defaults
  const theme = themeConfig || {
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    fontFamily: 'Inter',
    headerStyle: 'centered'
  };
  
  // Format the date nicely
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Animate in on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = () => {
    setIsOpening(true);
    
    // Delay the actual opening to allow animation to complete
    setTimeout(() => {
      onOpen();
    }, 1000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ 
        backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : 'none',
        backgroundColor: theme.backgroundImage ? 'transparent' : theme.primaryColor,
      }}
    >
      <div 
        className={`relative max-w-md w-full bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
      >
        {/* Cover Image */}
        <div className="relative h-80 w-full">
          {coverImage ? (
            <Image
              src={coverImage}
              alt="Wedding Cover"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div 
              className="absolute inset-0" 
              style={{ backgroundColor: theme.primaryColor }}
            ></div>
          )}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 
                className="text-3xl md:text-4xl mb-2 leading-tight"
                style={{ fontFamily: theme.fontFamily }}
              >
                {brideName} & {groomName}
              </h1>
              <p className="text-lg">{formattedDate}</p>
            </div>
          </div>
        </div>
        
        {/* Greeting */}
        <div 
          className={`p-8 text-center transition-all duration-500 ease-in-out ${isOpening ? 'opacity-0 -translate-y-6' : 'opacity-100 translate-y-0'}`}
        >
          <h2 className="text-2xl font-medium mb-3">Wedding Invitation</h2>
          <p 
            className="text-xl mb-6"
            style={{ fontFamily: theme.fontFamily }}
          >
            {guestName}
          </p>
          <p className="mb-8">You are cordially invited to celebrate our wedding</p>
          
          <button
            onClick={handleOpen}
            className="px-8 py-3 rounded-full font-medium shadow-md transition-colors duration-200"
            style={{ 
              backgroundColor: theme.primaryColor,
              color: theme.secondaryColor
            }}
          >
            Open Invitation
          </button>
        </div>
      </div>
    </div>
  );
} 