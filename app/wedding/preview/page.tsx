import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Wedding from '@/models/Wedding';
import WeddingDisplay from '@/components/wedding-display';

// Define the same interface as in the [slug]/page.tsx for consistency
interface WeddingData {
  _id: string;
  brideName: string;
  groomName: string;
  date: Date | string;
  time: string;
  venue: string;
  address: string;
  city: string;
  country: string;
  theme: string;
  story?: string;
  gallery?: string[];
  slug: string;
  events?: Array<{
    title: string;
    date: Date | string;
    time: string;
    venue: string;
    description?: string;
  }>;
  parentNames?: {
    bride?: {
      father?: string;
      mother?: string;
    };
    groom?: {
      father?: string;
      mother?: string;
    };
  };
}

export const metadata: Metadata = {
  title: 'Wedding Preview',
  description: 'Preview your wedding invitation',
};

export default async function WeddingPreviewPage() {
  // Get the current authenticated user
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/login');
  }
  
  await dbConnect();
  
  // Find the wedding belonging to the current user
  const weddingDoc = await Wedding.findOne({ userId: session.user.id }).lean();
  
  if (!weddingDoc) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">No Wedding Found</h1>
        <p className="text-gray-600 mb-6">
          You haven't created a wedding invitation yet. Create one to see a preview.
        </p>
        <a 
          href="/dashboard/weddings/new" 
          className="rounded-lg bg-rose-500 px-4 py-2 text-white hover:bg-rose-600"
        >
          Create Wedding Invitation
        </a>
      </div>
    );
  }
  
  // Convert mongo document to plain object
  const wedding = JSON.parse(JSON.stringify(weddingDoc)) as WeddingData;
  
  // Use a sample guest name for preview
  const sampleGuestName = "Preview Guest";
  
  return <WeddingDisplay weddingData={wedding} isPreview={true} guestName={sampleGuestName} />;
} 