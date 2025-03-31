"use client"

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { deleteImage } from '@/lib/cloudinary';
import { useToast } from '@/hooks/use-toast';
import { X, Upload, Loader2 } from 'lucide-react';

interface GalleryUploaderProps {
  existingImages: string[];
  onImagesChange: (images: string[]) => void;
}

export default function GalleryUploader({ existingImages = [], onImagesChange }: GalleryUploaderProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const uploadedUrls = [];
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        
        // Create FormData
        const formData = new FormData();
        formData.append('file', file);
        
        // Upload using our server-side endpoint
        const response = await fetch('/api/cloudinary/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const error = await response.json();
          console.error('Upload error:', error);
          throw new Error(`Upload failed: ${error.error || 'Unknown error'}`);
        }
        
        const result = await response.json();
        uploadedUrls.push(result.secure_url);
      }
      
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      onImagesChange(newImages);
      
      toast({
        title: "Images uploaded",
        description: `Successfully uploaded ${uploadedUrls.length} images`,
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your images",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      e.target.value = '';
    }
  }, [images, onImagesChange, toast]);

  const handleImageDelete = useCallback(async (imageUrl: string, index: number) => {
    try {
      // Remove from UI first for better user experience
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      onImagesChange(newImages);
      
      // Then delete from Cloudinary
      await deleteImage(imageUrl);
      
      toast({
        title: "Image deleted",
        description: "Image has been removed from your gallery",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Deletion failed",
        description: "There was an error deleting your image",
        variant: "destructive",
      });
    }
  }, [images, onImagesChange, toast]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button 
          type="button" 
          variant="outline" 
          className="flex items-center gap-2" 
          disabled={isUploading}
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Upload Images
        </Button>
        <input
          id="image-upload"
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />
        <p className="text-sm text-muted-foreground">
          Upload your wedding photos (max 10 MB per image)
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group aspect-square rounded-md overflow-hidden">
              <Image 
                src={image} 
                alt={`Gallery image ${index + 1}`} 
                fill 
                className="object-cover"
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleImageDelete(image, index)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}