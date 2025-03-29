import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Wedding from '@/models/Wedding';
import WeddingDisplay from '@/components/wedding-display';

type Props = {
  params: {
    slug: string;
  };
  searchParams: {
    guest?: string;
  };
};

// Define a simpler interface for wedding data
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
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Ensure params is properly awaited
  const { slug } = params;
  
  await dbConnect();
  
  // Find wedding by slug
  const weddingDoc = await Wedding.findOne({ slug }).lean();
  
  if (!weddingDoc) {
    return {
      title: 'Wedding Not Found',
      description: 'The wedding page you are looking for does not exist.',
    };
  }
  
  // Convert mongo document to plain object
  const wedding = JSON.parse(JSON.stringify(weddingDoc)) as WeddingData;
  
  return {
    title: `${wedding.brideName} & ${wedding.groomName} Wedding Invitation`,
    description: `You are cordially invited to the wedding of ${wedding.brideName} & ${wedding.groomName} on ${new Date(wedding.date).toLocaleDateString()}`,
    openGraph: {
      title: `${wedding.brideName} & ${wedding.groomName} Wedding Invitation`,
      description: `You are cordially invited to the wedding of ${wedding.brideName} & ${wedding.groomName} on ${new Date(wedding.date).toLocaleDateString()}`,
      images: wedding.gallery && wedding.gallery.length > 0 ? [wedding.gallery[0]] : [],
    },
  };
}

export default async function WeddingPage({ params, searchParams }: Props) {
  // Ensure params is properly awaited
  const { slug } = params;
  
  await dbConnect();
  
  // Find wedding by slug
  const weddingDoc = await Wedding.findOne({ slug }).lean();
  
  if (!weddingDoc) {
    notFound();
  }
  
  // Convert mongo document to plain object
  const wedding = JSON.parse(JSON.stringify(weddingDoc)) as WeddingData;
  
  return <WeddingDisplay wedding={wedding} />;
} 