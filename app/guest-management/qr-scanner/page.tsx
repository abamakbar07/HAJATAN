import { Metadata } from 'next';
import QRCodeScanner from '@/components/QRCodeScanner';

export const metadata: Metadata = {
  title: 'QR Code Scanner | HAJATAN',
  description: 'Scan QR codes to check in guests at your wedding event.',
};

export default function QRScannerPage() {
  const handleScan = async (data: string) => {
    try {
      const response = await fetch('/api/guests/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qrCode: data,
        }),
      });
      
      const result = await response.json();
      
      return {
        success: result.success,
        message: result.message,
        guestName: result.guestName,
      };
    } catch (error) {
      console.error('Error processing QR code:', error);
      return {
        success: false,
        message: 'An error occurred while processing the QR code.',
      };
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Guest Check-in</h1>
      
      <div className="max-w-md mx-auto">
        <QRCodeScanner onScan={handleScan} />
      </div>
    </div>
  );
} 