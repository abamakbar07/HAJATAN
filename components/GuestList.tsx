'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MoreHorizontal, 
  Search, 
  CheckCircle2, 
  XCircle,
  Download,
  Mail,
  Copy
} from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface Guest {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'pending' | 'attending' | 'not-attending';
  numberOfGuests: number;
  message?: string;
  qrCode?: string;
  checkedIn: boolean;
  checkedInAt?: string;
}

interface GuestListProps {
  weddingId: string;
  className?: string;
}

export default function GuestList({ weddingId, className }: GuestListProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!weddingId) return;
    
    const fetchGuests = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/guests?weddingId=${weddingId}`);
        if (!response.ok) throw new Error('Failed to fetch guests');
        
        const data = await response.json();
        setGuests(data);
      } catch (error) {
        console.error('Error fetching guests:', error);
        toast({
          title: 'Error',
          description: 'Failed to load guest list',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchGuests();
  }, [weddingId, toast]);

  const handleSendInvitation = async (guest: Guest) => {
    try {
      const response = await fetch(`/api/guests/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestId: guest._id,
          weddingId,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to send invitation');
      
      toast({
        title: 'Invitation Sent',
        description: `Invitation sent to ${guest.name}`,
      });
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive',
      });
    }
  };

  const handleCopyInvitationLink = (guest: Guest) => {
    if (!guest.qrCode) return;
    
    const invitationUrl = `${window.location.origin}/wedding/invitation?code=${encodeURIComponent(guest.qrCode)}`;
    
    navigator.clipboard.writeText(invitationUrl).then(
      () => {
        toast({
          title: 'Link Copied',
          description: 'Invitation link copied to clipboard',
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast({
          title: 'Error',
          description: 'Failed to copy link',
          variant: 'destructive',
        });
      }
    );
  };

  const handleShowQR = (guest: Guest) => {
    setSelectedGuest(guest);
    setShowQRModal(true);
  };

  const filteredGuests = guests.filter(guest => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      guest.name.toLowerCase().includes(query) ||
      guest.email.toLowerCase().includes(query) ||
      (guest.phone && guest.phone.includes(query))
    );
  });

  const getStatusBadge = (status: Guest['status']) => {
    switch (status) {
      case 'attending':
        return <Badge variant="default" className="bg-green-500">Attending</Badge>;
      case 'not-attending':
        return <Badge variant="destructive">Not Attending</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search guests..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">Export List</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Checked In</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading guests...
                </TableCell>
              </TableRow>
            ) : filteredGuests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {searchQuery ? 'No matching guests found' : 'No guests yet'}
                </TableCell>
              </TableRow>
            ) : (
              filteredGuests.map((guest) => (
                <TableRow key={guest._id}>
                  <TableCell className="font-medium">{guest.name}</TableCell>
                  <TableCell>{guest.email}</TableCell>
                  <TableCell>{getStatusBadge(guest.status)}</TableCell>
                  <TableCell>{guest.numberOfGuests}</TableCell>
                  <TableCell>
                    {guest.checkedIn ? (
                      <div className="flex items-center">
                        <CheckCircle2 className="text-green-500 h-5 w-5 mr-1" />
                        <span className="text-xs text-muted-foreground">
                          {guest.checkedInAt && new Date(guest.checkedInAt).toLocaleTimeString()}
                        </span>
                      </div>
                    ) : (
                      <XCircle className="text-muted-foreground h-5 w-5" />
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleShowQR(guest)}>
                          <Download className="h-4 w-4 mr-2" />
                          View QR Code
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendInvitation(guest)}>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Invitation
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopyInvitationLink(guest)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Invitation Link
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Guest QR Code</DialogTitle>
          </DialogHeader>
          {selectedGuest && selectedGuest.qrCode && (
            <div className="flex flex-col items-center">
              <QRCodeGenerator 
                value={selectedGuest.qrCode} 
                guestName={selectedGuest.name}
                size={250}
              />
              <p className="mt-4 text-sm text-muted-foreground">
                This QR code can be used to check in {selectedGuest.name} at the wedding
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 