'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown, ChevronDown, Download, Plus, Search, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const [searchTerm, setSearchTerm] = useState('');
  const [guests, setGuests] = useState<any[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);

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

  // Add function to fetch guests
  const fetchGuests = async (weddingId: string) => {
    try {
      const response = await fetch(`/api/guests?weddingId=${weddingId}`);
      const data = await response.json();
      setGuests(data);
    } catch (error) {
      console.error('Error fetching guests:', error);
    }
  };

  useEffect(() => {
    if (selectedWeddingId) {
      fetchGuests(selectedWeddingId);
    }
  }, [selectedWeddingId]);

  // Add this function to handle guest deletion
  const handleDeleteGuest = async (guestId: string) => {
    try {
      const response = await fetch(`/api/guests/${guestId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete guest');
      toast({
        title: 'Success',
        description: 'Guest deleted successfully',
      });
      fetchGuests(selectedWeddingId);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete guest',
        variant: 'destructive',
      });
    }
  };

  // Filter guests based on search term
  const filteredGuests = guests.filter(guest =>
    guest.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Guest Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <AddGuestForm 
            // isRegister={true}
            weddingId={selectedWeddingId}
            onSuccess={() => fetchGuests(selectedWeddingId)}
          />
        </div>
      </div>

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
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Guest List</CardTitle>
            <CardDescription>Manage your wedding guests and track their RSVP status</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All Guests</TabsTrigger>
                  <TabsTrigger value="attending">Attending</TabsTrigger>
                  <TabsTrigger value="not-attending">Not Attending</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search guests..."
                      className="w-[200px] pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Import Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>CSV File</DropdownMenuItem>
                      <DropdownMenuItem>Excel File</DropdownMenuItem>
                      <DropdownMenuItem>Google Contacts</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <TabsContent value="all">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <Button variant="ghost" className="p-0 font-medium">
                          Name
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGuests.map((guest) => (
                      <TableRow key={guest._id}>
                        <TableCell className="font-medium">{guest.name}</TableCell>
                        <TableCell>
                          <div className="text-sm">{guest.email}</div>
                          {guest.phone && (
                            <div className="text-xs text-muted-foreground">{guest.phone}</div>
                          )}
                        </TableCell>
                        <TableCell>{guest.group}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            guest.status === "attending"
                              ? "bg-green-100 text-green-800"
                              : guest.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}>
                            {guest.status}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedGuest(guest)}>
                                Edit Guest
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteGuest(guest._id)}>
                                Remove Guest
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              {/* ...similar TabsContent for other tabs... */}
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Please select a wedding to manage its guest list
            </p>
          </CardContent>
        </Card>
      )}

      <AddGuestForm 
        weddingId={selectedWeddingId}
        guestData={selectedGuest}
        isOpen={!!selectedGuest}
        onOpenChange={(open) => !open && setSelectedGuest(null)}
        onSuccess={() => {
          fetchGuests(selectedWeddingId);
          setSelectedGuest(null);
        }}
      />
    </div>
  );
}