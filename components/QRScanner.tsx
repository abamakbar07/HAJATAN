'use client';

import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface QRScannerProps {
  onScan: (qrCode: string) => Promise<{ success: boolean; message: string; guestName?: string }>;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; guestName?: string } | null>(null);

  const handleScan = async (result: string | null) => {
    if (result && !processing) {
      setProcessing(true);
      try {
        const response = await onScan(result);
        setResult(response);
        setScanning(false);
      } catch (error) {
        console.error('Error processing QR code:', error);
        setResult({
          success: false,
          message: 'An error occurred while processing the QR code',
        });
      } finally {
        setProcessing(false);
      }
    }
  };

  const startScanning = () => {
    setScanning(true);
    setResult(null);
  };

  const stopScanning = () => {
    setScanning(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Guest Check-In Scanner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {scanning ? (
          <div className="overflow-hidden rounded-lg">
            <QrReader
              constraints={{ facingMode: 'environment' }}
              onResult={(result, error) => {
                if (result) {
                  handleScan(result.getText());
                }
                if (error) {
                  console.info(error);
                }
              }}
              scanDelay={500}
              className="w-full"
              videoStyle={{ width: '100%' }}
            />
            <Button onClick={stopScanning} variant="outline" className="w-full mt-4">
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {result ? (
              <Alert
                variant={result.success ? 'default' : 'destructive'}
                className="mb-4"
              >
                <div className="flex items-center gap-2">
                  {result.success ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  <AlertTitle>{result.success ? 'Success' : 'Error'}</AlertTitle>
                </div>
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            ) : null}

            <Button
              onClick={startScanning}
              disabled={processing}
              className="w-full mt-2"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Scan QR Code'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 