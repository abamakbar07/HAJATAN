'use client';

import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  guestName?: string;
  downloadable?: boolean;
}

export default function QRCodeGenerator({
  value,
  size = 200,
  guestName,
  downloadable = true,
}: QRCodeGeneratorProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      const canvas = document.getElementById('guest-qr-code') as HTMLCanvasElement;
      if (!canvas) return;

      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `invitation-qr-${guestName ? guestName.replace(/\s+/g, '-').toLowerCase() : 'guest'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="w-fit mx-auto shadow-md">
      <CardContent className="p-6 text-center">
        <div className="bg-white p-4 rounded-lg inline-block">
          <QRCodeCanvas
            id="guest-qr-code"
            value={value}
            size={size}
            level="H"
            includeMargin
          />
        </div>
        
        {guestName && (
          <div className="mt-4 text-lg font-medium">
            {guestName}
          </div>
        )}
        
        {downloadable && (
          <Button 
            onClick={handleDownload} 
            className="mt-4" 
            disabled={isDownloading}
          >
            {isDownloading ? 'Downloading...' : 'Download QR Code'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
} 