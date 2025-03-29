import { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
  guestName: string;
}

export default function QRCodeGenerator({ value, size = 256, className, guestName }: QRCodeGeneratorProps) {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [canShare, setCanShare] = useState(false);
  
  useEffect(() => {
    // Check if the Web Share API is available
    setCanShare(!!navigator.share);
  }, []);
  
  const downloadQRCode = () => {
    if (!canvasRef) return;
    
    const canvas = canvasRef;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = image;
    link.download = `qr-code-${guestName.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const shareQRCode = async () => {
    if (!canvasRef || !canShare) return;
    
    const canvas = canvasRef;
    
    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          }
        }, 'image/png');
      });
      
      // Create file from blob
      const file = new File([blob], `qr-code-${guestName.replace(/\s+/g, '-').toLowerCase()}.png`, { type: 'image/png' });
      
      // Share the file
      await navigator.share({
        title: 'Wedding QR Code',
        text: `QR Code for ${guestName}`,
        files: [file],
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <QRCodeCanvas
          value={value}
          size={size}
          level="H"
          includeMargin
          ref={(el: HTMLCanvasElement | null) => setCanvasRef(el)}
        />
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={downloadQRCode}
        >
          <Download size={16} />
          Download
        </Button>
        
        {canShare && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={shareQRCode}
          >
            <Share2 size={16} />
            Share
          </Button>
        )}
      </div>
    </div>
  );
} 