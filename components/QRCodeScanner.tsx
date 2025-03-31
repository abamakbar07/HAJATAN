'use client'

import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface QRCodeScannerProps {
  onScan: (data: string) => Promise<{ success: boolean; message: string; guestName?: string }>;
  className?: string;
}

export default function QRCodeScanner({ onScan, className }: QRCodeScannerProps) {
  const [scanning, setScanning] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<{ success: boolean; message: string; guestName?: string } | null>(null);
  const { toast } = useToast();
  
  const handleScan = async (result: string | null) => {
    if (result && !processing) {
      setProcessing(true);
      setScanning(false);
      
      try {
        const response = await onScan(result);
        setLastResult(response);
        
        toast({
          title: response.success ? 'Check-in Successful' : 'Check-in Failed',
          description: response.message,
          variant: response.success ? 'default' : 'destructive',
        });
      } catch (error) {
        console.error('Error processing QR code:', error);
        setLastResult({
          success: false,
          message: 'An error occurred while processing the QR code.',
        });
        
        toast({
          title: 'Error',
          description: 'An error occurred while processing the QR code.',
          variant: 'destructive',
        });
      } finally {
        setProcessing(false);
      }
    }
  };
  
  const handleError = (error: Error) => {
    console.error('QR scanner error:', error);
    toast({
      title: 'Scanner Error',
      description: 'Could not access camera. Please check permissions.',
      variant: 'destructive',
    });
  };
  
  const resetScanner = () => {
    setLastResult(null);
    setScanning(true);
  };
  
  return (
    <Card className={`w-full max-w-md mx-auto overflow-hidden ${className}`}>
      <CardHeader>
        <CardTitle className="text-center">Guest Check-in Scanner</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {scanning ? (
          <div className="relative aspect-square overflow-hidden rounded-md">
            <QrReader
              constraints={{ 
                facingMode: 'environment',
              }}
              onResult={(result) => result && handleScan(result.getText())}
              containerStyle={{ width: '100%', height: '100%' }}
              videoStyle={{ width: '100%', height: '100%' }}
              scanDelay={500}
              videoId="qr-video"
            />
            <div className="absolute inset-0 border-2 border-white border-opacity-50 pointer-events-none" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            {processing ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-medium">Processing...</p>
              </div>
            ) : lastResult && (
              <div className="flex flex-col items-center gap-4">
                {lastResult.success ? (
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-1">
                    {lastResult.success ? 'Check-in Successful' : 'Check-in Failed'}
                  </h3>
                  {lastResult.guestName && (
                    <p className="text-lg font-medium mb-2">{lastResult.guestName}</p>
                  )}
                  <p className="text-gray-500">{lastResult.message}</p>
                </div>
                
                <Button 
                  onClick={resetScanner} 
                  className="mt-4"
                >
                  Scan Another QR Code
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 