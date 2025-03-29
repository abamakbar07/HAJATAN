'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { Share2, Copy, Loader2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  group: string;
}

interface Wedding {
  id: string;
  title: string;
  date: string;
  slug: string;
}

interface WeddingData {
  wedding: Wedding;
  guests: Guest[];
}

interface InvitationGeneratorProps {
  weddingData: WeddingData[];
}

interface InvitationResult {
  id: string;
  name: string;
  email: string;
  phone?: string;
  success: boolean;
  message?: string;
  invitationLink?: string;
  qrCodeImage?: string;
}

interface InvitationResponse {
  success: boolean;
  message?: string;
  results: InvitationResult[];
}

interface GeneratedInvitation {
  id: string;
  name: string;
  invitationLink: string;
  qrCodeImage: string;
}

export default function InvitationGenerator({ weddingData }: InvitationGeneratorProps) {
  const [activeWedding, setActiveWedding] = useState<string>(
    weddingData.length > 0 ? weddingData[0].wedding.id : ''
  );
  const [selectedGuests, setSelectedGuests] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedInvitations, setGeneratedInvitations] = useState<GeneratedInvitation[]>([]);
  
  const { toast } = useToast();
  
  const handleSelectAllGuests = (checked: boolean) => {
    const currentWedding = weddingData.find(wd => wd.wedding.id === activeWedding);
    
    if (!currentWedding) return;
    
    const newSelectedGuests = { ...selectedGuests };
    
    currentWedding.guests.forEach(guest => {
      newSelectedGuests[guest.id] = checked;
    });
    
    setSelectedGuests(newSelectedGuests);
  };
  
  const handleSelectGuest = (guestId: string, checked: boolean) => {
    setSelectedGuests(prev => ({
      ...prev,
      [guestId]: checked,
    }));
  };
  
  const handleGenerateInvitations = async () => {
    const currentWedding = weddingData.find(wd => wd.wedding.id === activeWedding);
    
    if (!currentWedding) return;
    
    const selectedGuestIds = Object.entries(selectedGuests)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
    
    if (selectedGuestIds.length === 0) {
      toast({
        title: 'No guests selected',
        description: 'Please select at least one guest to generate invitations.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/guests/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestIds: selectedGuestIds,
          weddingId: activeWedding,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate invitations');
      }
      
      const data = await response.json() as InvitationResponse;
      
      if (data.success) {
        toast({
          title: 'Invitations Generated',
          description: `Successfully generated invitations for ${data.results.filter(r => r.success).length} guests.`,
        });
        
        // Filter successful results and format for display
        const successfulInvitations = data.results
          .filter(result => result.success && result.invitationLink && result.qrCodeImage)
          .map(result => ({
            id: result.id,
            name: result.name,
            invitationLink: result.invitationLink!,
            qrCodeImage: result.qrCodeImage!,
          }));
        
        setGeneratedInvitations(successfulInvitations);
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to generate invitations.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error generating invitations:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate invitations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: 'Copied!',
          description: 'Invitation link copied to clipboard.',
        });
      },
      () => {
        toast({
          title: 'Failed to copy',
          description: 'Could not copy link to clipboard.',
          variant: 'destructive',
        });
      }
    );
  };
  
  const shareInvitation = async (link: string, guestName: string) => {
    if (!navigator.share) {
      copyToClipboard(link);
      return;
    }
    
    try {
      await navigator.share({
        title: 'Wedding Invitation',
        text: `You're invited to our wedding! RSVP here: ${link}`,
        url: link,
      });
      
      toast({
        title: 'Shared',
        description: `Invitation for ${guestName} has been shared.`,
      });
    } catch (error) {
      console.error('Error sharing invitation:', error);
      copyToClipboard(link);
    }
  };
  
  return (
    <div className="space-y-6">
      {weddingData.length > 0 ? (
        <>
          <Tabs 
            defaultValue={activeWedding} 
            onValueChange={value => {
              setActiveWedding(value);
              setSelectedGuests({});
              setGeneratedInvitations([]);
            }}
          >
            <TabsList className="w-full justify-start overflow-x-auto">
              {weddingData.map(wd => (
                <TabsTrigger key={wd.wedding.id} value={wd.wedding.id} className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="truncate max-w-[120px]">{wd.wedding.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(wd.wedding.date), 'MMM d, yyyy')}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {weddingData.map(wd => (
              <TabsContent key={wd.wedding.id} value={wd.wedding.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>Select Guests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`select-all-${wd.wedding.id}`}
                          checked={wd.guests.every(g => selectedGuests[g.id])}
                          onCheckedChange={(checked) => 
                            handleSelectAllGuests(checked as boolean)
                          }
                        />
                        <label 
                          htmlFor={`select-all-${wd.wedding.id}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          Select All ({wd.guests.length})
                        </label>
                      </div>
                      
                      <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
                        {wd.guests.length > 0 ? (
                          <div className="divide-y">
                            {wd.guests.map(guest => (
                              <div 
                                key={guest.id} 
                                className="py-2 flex items-center space-x-2"
                              >
                                <Checkbox 
                                  id={`guest-${guest.id}`}
                                  checked={selectedGuests[guest.id] || false}
                                  onCheckedChange={(checked) => 
                                    handleSelectGuest(guest.id, checked as boolean)
                                  }
                                />
                                <label 
                                  htmlFor={`guest-${guest.id}`}
                                  className="flex-1 cursor-pointer"
                                >
                                  <div className="font-medium">{guest.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {guest.email}
                                    {guest.phone && ` • ${guest.phone}`}
                                  </div>
                                </label>
                                <div className="text-xs px-2 py-1 rounded-full bg-muted">
                                  {guest.group}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            No guests found for this wedding
                          </div>
                        )}
                      </div>
                      
                      <Button
                        onClick={handleGenerateInvitations}
                        disabled={isGenerating || Object.values(selectedGuests).filter(Boolean).length === 0}
                        className="w-full"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          'Generate Invitations'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {generatedInvitations.length > 0 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Generated Invitations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {generatedInvitations.map(invitation => (
                          <div 
                            key={invitation.id}
                            className="border rounded-md p-4"
                          >
                            <div className="font-medium text-lg mb-2">
                              {invitation.name}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                              <div>
                                <div className="font-medium mb-2">Invitation Link:</div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    readOnly
                                    value={invitation.invitationLink}
                                    className="flex-1 px-3 py-2 text-sm border rounded-md"
                                  />
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => copyToClipboard(invitation.invitationLink)}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => shareInvitation(invitation.invitationLink, invitation.name)}
                                  >
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="flex justify-center">
                                <QRCodeGenerator
                                  value={invitation.invitationLink}
                                  guestName={invitation.name}
                                  size={150}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p>No weddings found. Create a wedding first to manage guests.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 