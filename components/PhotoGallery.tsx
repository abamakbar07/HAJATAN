"use client"

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export type GalleryLayout = 'grid' | 'masonry' | 'carousel' | 'slider';
export type GalleryEffect = 'zoom' | 'fade' | 'slide' | 'none';

interface GalleryConfig {
  spacing: number;
  showCaptions: boolean;
  borderRadius: number;
  effect: GalleryEffect;
}

interface PhotoGalleryProps {
  images: string[];
  layout?: GalleryLayout;
  config?: Partial<GalleryConfig>;
  className?: string;
}

interface ImageItem {
  image: string;
  index: number;
}

const defaultConfig: GalleryConfig = {
  spacing: 8,
  showCaptions: false,
  borderRadius: 8,
  effect: 'zoom'
};

export default function PhotoGallery({ 
  images, 
  layout = 'grid', 
  config = {}, 
  className 
}: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  
  // Merge default config with provided config
  const fullConfig = { ...defaultConfig, ...config };
  
  const openLightbox = (image: string, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };
  
  const nextImage = () => {
    if (selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setSelectedImage(images[selectedIndex + 1]);
    }
  };
  
  const prevImage = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setSelectedImage(images[selectedIndex - 1]);
    }
  };

  const renderGrid = () => {
    return (
      <div 
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-${fullConfig.spacing}`}
      >
        {images.map((image, index) => (
          <div 
            key={index} 
            className={`relative aspect-square rounded-[${fullConfig.borderRadius}px] overflow-hidden cursor-pointer`}
            onClick={() => openLightbox(image, index)}
          >
            <Image
              src={image}
              alt={`Wedding photo ${index + 1}`}
              fill
              className={`object-cover ${fullConfig.effect === 'zoom' ? 'hover:scale-105 transition-transform duration-300' : ''}`}
            />
            {fullConfig.showCaptions && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm">
                Photo {index + 1}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderMasonry = () => {
    // Split images into columns
    const columns: ImageItem[][] = [[], [], []];
    images.forEach((image, i) => {
      columns[i % 3].push({ image, index: i });
    });

    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-${fullConfig.spacing}`}>
        {columns.map((column, colIndex) => (
          <div key={colIndex} className={`flex flex-col gap-${fullConfig.spacing}`}>
            {column.map(({ image, index }) => (
              <div 
                key={index}
                className={`relative rounded-[${fullConfig.borderRadius}px] overflow-hidden cursor-pointer`}
                style={{ 
                  height: `${Math.floor(200 + Math.random() * 100)}px`,
                }}
                onClick={() => openLightbox(image, index)}
              >
                <Image
                  src={image}
                  alt={`Wedding photo ${index + 1}`}
                  fill
                  className={`object-cover ${fullConfig.effect === 'zoom' ? 'hover:scale-105 transition-transform duration-300' : ''}`}
                />
                {fullConfig.showCaptions && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm">
                    Photo {index + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderCarousel = () => {
    return (
      <div className="relative w-full overflow-hidden">
        <div className="flex py-4 overflow-x-auto space-x-4 scrollbar-hide">
          {images.map((image, index) => (
            <div 
              key={index}
              className={`relative flex-none w-64 h-64 rounded-[${fullConfig.borderRadius}px] overflow-hidden cursor-pointer`}
              onClick={() => openLightbox(image, index)}
            >
              <Image
                src={image}
                alt={`Wedding photo ${index + 1}`}
                fill
                className="object-cover"
              />
              {fullConfig.showCaptions && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm text-center">
                  Photo {index + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGallery = () => {
    switch (layout) {
      case 'masonry':
        return renderMasonry();
      case 'carousel':
        return renderCarousel();
      case 'grid':
      default:
        return renderGrid();
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <h2 className="text-3xl font-semibold text-center mb-6">Our Gallery</h2>
      
      {renderGallery()}

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black/90 border-none">
          {selectedImage && (
            <div className="relative w-full aspect-[4/3]">
              <button
                onClick={prevImage}
                disabled={selectedIndex === 0}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-white/20 rounded-full p-2 hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              
              <Image
                src={selectedImage}
                alt="Selected wedding photo"
                fill
                className="object-contain"
                priority
              />
              
              <button
                onClick={nextImage}
                disabled={selectedIndex === images.length - 1}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-white/20 rounded-full p-2 hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
              
              {fullConfig.showCaptions && (
                <div className="absolute bottom-4 left-0 right-0 text-white text-center">
                  Photo {selectedIndex + 1} of {images.length}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 