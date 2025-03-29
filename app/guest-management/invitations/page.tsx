import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Guest from '@/models/Guest';
import Wedding from '@/models/Wedding';
import InvitationGenerator from '@/app/guest-management/invitations/InvitationGenerator';

export const metadata: Metadata = {
  title: 'Generate Invitations | HAJATAN',
  description: 'Generate and send personalized wedding invitations to your guests.',
};

export default async function InvitationsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  await dbConnect();
  
  // Find user's weddings
  const weddings = await Wedding.find({ userId: session.user.id });
  
  if (weddings.length === 0) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-6">No Weddings Found</h1>
        <p className="mb-4">You need to create a wedding before you can manage guests.</p>
        <a 
          href="/dashboard/weddings/new" 
          className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Create a Wedding
        </a>
      </div>
    );
  }
  
  // Get all guests for the user's weddings
  const weddingIds = weddings.map(wedding => wedding._id);
  const guests = await Guest.find({ weddingId: { $in: weddingIds } });
  
  // Group guests by wedding
  const guestsByWedding = weddings.map(wedding => {
    const weddingGuests = guests.filter(guest => 
      guest.weddingId.toString() === wedding._id.toString()
    );
    
    return {
      wedding: {
        id: wedding._id.toString(),
        title: `${wedding.brideName} & ${wedding.groomName}`,
        date: wedding.date,
        slug: wedding.slug,
      },
      guests: weddingGuests.map(guest => ({
        id: guest._id.toString(),
        name: guest.name,
        email: guest.email,
        phone: guest.phone || '',
        status: guest.status,
        group: guest.group,
      })),
    };
  });
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Generate Invitations</h1>
      
      <InvitationGenerator weddingData={guestsByWedding} />
    </div>
  );
} 