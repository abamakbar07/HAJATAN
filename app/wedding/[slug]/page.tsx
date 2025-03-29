import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Wedding, { IWedding } from '@/models/Wedding';
import { Separator } from '@/components/ui/separator';
import CountdownTimer from '@/components/CountdownTimer';
import LoveStory from '@/components/LoveStory';
import VenueMap from '@/components/VenueMap';
import PhotoGallery from '@/components/PhotoGallery';
import MusicPlayer from '@/components/MusicPlayer';
import RSVPForm from '@/components/RSVPForm';
import mongoose from 'mongoose';

type Props = {
  params: {
    slug: string;
  };
  searchParams: {
    guest?: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await dbConnect();
  
  const wedding = await Wedding.findOne({ slug: params.slug });
  
  if (!wedding) {
    return {
      title: 'Wedding Not Found',
      description: 'The wedding page you are looking for does not exist.',
    };
  }
  
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

// Define shape of wedding document when it comes from lean() query
interface WeddingDoc {
  _id: mongoose.Types.ObjectId;
  brideName: string;
  groomName: string;
  date: Date;
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
    date: Date;
    time: string;
    venue: string;
    description?: string;
  }>;
}

export default async function WeddingPage({ params, searchParams }: Props) {
  await dbConnect();
  
  // Use 'any' first, then type assertion after null check
  const weddingData = await Wedding.findOne({ slug: params.slug }).lean();
  
  if (!weddingData) {
    notFound();
  }
  
  // Now safe to cast to our interface
  const wedding = weddingData as unknown as WeddingDoc;
  
  // Format wedding dates and times
  const weddingDate = new Date(wedding.date);
  const formattedDate = weddingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Sample music URL - in a real app, you would get this from the wedding model
  const musicUrl = "https://example.com/sample-music.mp3";
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-primary-100">
      {/* Background Music */}
      <MusicPlayer url={musicUrl} />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        {wedding.gallery && wedding.gallery.length > 0 && (
          <div className="absolute inset-0 z-0">
            <Image
              src={wedding.gallery[0]}
              alt="Wedding Hero"
              fill
              className="object-cover brightness-50"
              priority
            />
          </div>
        )}
        
        <div className="relative z-10 text-center text-white p-6 max-w-3xl">
          <p className="text-lg mb-4 font-light">Together with their families</p>
          <h1 className="text-4xl md:text-6xl font-serif mb-4">
            {wedding.brideName} <span className="text-2xl md:text-3xl">&</span> {wedding.groomName}
          </h1>
          <p className="text-xl mb-8">REQUEST THE HONOR OF YOUR PRESENCE</p>
          <div className="text-lg mb-8">
            <p>{formattedDate}</p>
            <p>{wedding.time}</p>
            <p>{wedding.venue}, {wedding.city}</p>
          </div>
          
          <CountdownTimer targetDate={weddingDate} className="mt-8" />
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-16 space-y-24">
        {/* Love Story Section */}
        <section id="story" className="bg-white rounded-lg shadow-lg p-8">
          <LoveStory 
            story={wedding.story || "Our love story is still being written..."}
            images={wedding.gallery?.slice(0, 3) || []}
          />
        </section>
        
        {/* Event Details Section */}
        <section id="details" className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-semibold text-center mb-8">Event Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-medium text-center">Ceremony & Reception</h3>
              <div className="text-center">
                <p className="text-lg font-medium">{formattedDate}</p>
                <p>{wedding.time}</p>
                <p className="font-medium mt-4">{wedding.venue}</p>
                <p>{wedding.address}</p>
                <p>{wedding.city}, {wedding.country}</p>
              </div>
              
              {/* Additional Events */}
              {wedding.events && wedding.events.length > 0 && (
                <div className="mt-8 space-y-8">
                  <Separator />
                  
                  {wedding.events.map((event, index) => (
                    <div key={index} className="text-center">
                      <h4 className="text-xl font-medium">{event.title}</h4>
                      <p>{new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}</p>
                      <p>{event.time}</p>
                      <p className="font-medium mt-2">{event.venue}</p>
                      {event.description && <p className="mt-2 italic">{event.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <VenueMap address={`${wedding.venue}, ${wedding.address}, ${wedding.city}, ${wedding.country}`} />
            </div>
          </div>
        </section>
        
        {/* Photo Gallery Section */}
        {wedding.gallery && wedding.gallery.length > 0 && (
          <section id="gallery" className="bg-white rounded-lg shadow-lg p-8">
            <PhotoGallery images={wedding.gallery} />
          </section>
        )}
        
        {/* RSVP Section */}
        <section id="rsvp" className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-semibold text-center mb-8">RSVP</h2>
          <RSVPForm weddingId={wedding._id.toString()} />
        </section>
      </div>
      
      {/* Footer */}
      <footer className="bg-primary text-white py-6 text-center">
        <p className="text-lg font-serif mb-2">{wedding.brideName} & {wedding.groomName}</p>
        <p className="text-sm">{formattedDate}</p>
        <p className="text-xs mt-4">Powered by HAJATAN</p>
      </footer>
    </div>
  );
} 