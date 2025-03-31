'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GuestList from '@/components/GuestList';
import { useToast } from '@/components/ui/use-toast';
import AddGuestForm from '@/components/AddGuestForm';

export default function GuestManagementPage() {
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

  const handleWeddingSelect = (weddingId: string) => {
    setSelectedWeddingId(weddingId);
    // Update URL with the selected wedding ID
    const params = new URLSearchParams(searchParams.toString());
    params.set('weddingId', weddingId);
    router.push(`/dashboard/guest-management?${params.toString()}`);
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Guest Management</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Wedding Selection</CardTitle>
          <CardDescription>Select which wedding's guest list to manage</CardDescription>
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

      {selectedWeddingId ? (
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="list">Guest List</TabsTrigger>
            <TabsTrigger value="add">Add Guests</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <GuestList weddingId={selectedWeddingId} />
          </TabsContent>
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add New Guests</CardTitle>
                <CardDescription>
                  Add guests individually or import a list from a spreadsheet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddGuestForm 
                  weddingId={selectedWeddingId}
                  onSuccess={() => {
                    toast({
                      title: 'Guest Added',
                      description: 'New guest has been added successfully',
                    });
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Please select a wedding to manage its guest list
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
} 