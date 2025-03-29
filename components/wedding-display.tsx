'use client'

import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import CountdownTimer from '@/components/CountdownTimer';
import LoveStory from '@/components/LoveStory';
import VenueMap from '@/components/VenueMap';
import PhotoGallery from '@/components/PhotoGallery';
import MusicPlayer from '@/components/MusicPlayer';
import RSVPForm from '@/components/RSVPForm';

interface Event {
  title: string;
  date: Date | string;
  time: string;
  venue: string;
  description?: string;
}

interface WeddingDisplayProps {
  wedding: {
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
    events?: Event[];
  };
  isPreview?: boolean;
}

export default function WeddingDisplay({ wedding, isPreview = false }: WeddingDisplayProps) {
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
      {isPreview && (
        <div className="sticky top-0 z-50 bg-amber-500 text-amber-950 text-center py-2 shadow-md">
          <p className="font-semibold">Preview Mode - This is how your wedding invitation will look</p>
          <div className="text-sm">
            <Link href="/dashboard" className="underline hover:text-amber-800">Return to Dashboard</Link>
            {' • '}
            <Link href={`/dashboard/weddings/${wedding._id}/edit`} className="underline hover:text-amber-800">Edit Wedding</Link>
          </div>
        </div>
      )}
      
      {/* Background Music */}
      <MusicPlayer url={musicUrl} />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        {wedding.gallery && wedding.gallery.length > 0 ? (
          <div className="absolute inset-0 z-0">
            <Image
              src={wedding.gallery[0]}
              alt="Wedding Hero"
              fill
              className="object-cover brightness-50"
              priority
            />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-rose-300 to-rose-500"></div>
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