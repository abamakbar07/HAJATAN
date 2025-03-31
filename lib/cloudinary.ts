// Using next-cloudinary package
import { CldUploadWidget } from 'next-cloudinary';

// Export CldUploadWidget for direct usage in components
export { CldUploadWidget };

// Function to parse Cloudinary URL and extract public ID
export const getPublicIdFromUrl = (url: string): string => {
  try {
    // Extract the path after the last '/' and before any file extension
    const urlParts = url.split('/');
    const filenameWithExtension = urlParts[urlParts.length - 1];
    const publicId = filenameWithExtension.split('.')[0];
    return publicId;
  } catch (error) {
    console.error('Error parsing Cloudinary URL:', error);
    return '';
  }
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    const publicId = getPublicIdFromUrl(imageUrl);
    
    if (!publicId) {
      throw new Error('Could not extract public ID from URL');
    }
    
    await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};