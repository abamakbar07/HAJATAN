'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import QRScanner from '@/components/QRScanner';
import { useToast } from '@/components/ui/use-toast';

export default function CheckInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const weddingId = searchParams.get('weddingId');
  const { toast } = useToast();
  const [selectedWeddingId, setSelectedWeddingId] = useState<string>(weddingId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [weddings, setWeddings] = useState<{ _id: string; brideName: string; groomName: string }[]>([]);

  // Function to fetch user's weddings
  const fetchWeddings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/weddings');
      if (!response.ok) {
        throw new Error('Failed to fetch weddings');
      }
      const data = await response.json();
      setWeddings(data);
      
      // If weddingId is not in URL but there's only one wedding, select it automatically
      if (!weddingId && data.length === 1) {
        setSelectedWeddingId(data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching weddings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch weddings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch weddings on component mount
  useEffect(() => {
    fetchWeddings();
  }, []);

  // Function to check in guests
  const handleGuestCheckIn = async (qrCode: string) => {
    if (!selectedWeddingId) {
      return {
        success: false,
        message: 'Please select a wedding first',
      };
    }

    try {
      const response = await fetch('/api/guests/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCode }),
      });

      const data = await response.json();

      return {
        success: data.success,
        message: data.message,
        guestName: data.guestName,
      };
    } catch (error) {
      console.error('Error checking in guest:', error);
      return {
        success: false,
        message: 'Failed to check in guest',
      };
    }
  };

  const handleWeddingSelect = (weddingId: string) => {
    setSelectedWeddingId(weddingId);
    // Update URL with the selected wedding ID
    const params = new URLSearchParams(searchParams.toString());
    params.set('weddingId', weddingId);
    router.push(`/dashboard/check-in?${params.toString()}`);
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Guest Check-In</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Wedding Selection</CardTitle>
          <CardDescription>Select which wedding you are checking guests in for</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedWeddingId}
            onValueChange={handleWeddingSelect}
            disabled={isLoading || weddings.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a wedding" />
            </SelectTrigger>
            <SelectContent>
              {weddings.map((wedding) => (
                <SelectItem key={wedding._id} value={wedding._id}>
                  {wedding.brideName} & {wedding.groomName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs defaultValue="scanner" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scanner">QR Scanner</TabsTrigger>
          <TabsTrigger value="list">Guest List</TabsTrigger>
        </TabsList>
        <TabsContent value="scanner">
          {selectedWeddingId ? (
            <QRScanner onScan={handleGuestCheckIn} />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Please select a wedding to start scanning QR codes
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="list">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                {selectedWeddingId 
                  ? 'Guest list will be shown here. You can manually check in guests if needed.'
                  : 'Please select a wedding to view the guest list'}
              </p>
              
              {selectedWeddingId && (
                <Button
                  onClick={() => router.push(`/dashboard/guest-management?weddingId=${selectedWeddingId}`)}
                >
                  View Complete Guest List
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
} 