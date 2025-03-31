import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Wedding from '@/models/Wedding';
import RSVPForm from '@/components/RSVPForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type Props = {
  params: {
    slug: string;
  };
};

// Define a simpler interface for wedding data
interface WeddingData {
  _id: string;
  brideName: string;
  groomName: string;
  date: Date | string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  
  await dbConnect();
  
  // Find wedding by slug
  const weddingDoc = await Wedding.findOne({ slug }).lean();
  
  if (!weddingDoc) {
    return {
      title: 'RSVP Not Found',
      description: 'The wedding page you are looking for does not exist.',
    };
  }
  
  // Convert mongo document to plain object
  const wedding = JSON.parse(JSON.stringify(weddingDoc)) as WeddingData;
  
  return {
    title: `RSVP - ${wedding.brideName} & ${wedding.groomName} Wedding`,
    description: `Confirm your attendance to the wedding of ${wedding.brideName} & ${wedding.groomName}`,
  };
}

export default async function RSVPPage({ params }: Props) {
  const { slug } = params;
  
  await dbConnect();
  
  // Find wedding by slug
  const weddingDoc = await Wedding.findOne({ slug }).lean();
  
  if (!weddingDoc) {
    notFound();
  }
  
  // Convert mongo document to plain object
  const wedding = JSON.parse(JSON.stringify(weddingDoc)) as WeddingData;
  const weddingDate = new Date(wedding.date);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-primary-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            RSVP
          </CardTitle>
          <CardDescription className="text-center">
            {wedding.brideName} & {wedding.groomName} Wedding
          </CardDescription>
          <p className="text-center text-sm text-muted-foreground">
            {weddingDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </CardHeader>
        <CardContent>
          <RSVPForm 
            weddingId={wedding._id.toString()} 
            onSuccess={() => {
              // This is a server component, but the RSVPForm will handle success client-side
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
} 