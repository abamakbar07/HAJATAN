'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import CountdownTimer from '@/components/CountdownTimer';
import LoveStory from '@/components/LoveStory';
import VenueMap from '@/components/VenueMap';
import PhotoGallery, { GalleryLayout, GalleryEffect } from '@/components/PhotoGallery';
import MusicPlayer from '@/components/MusicPlayer';
import RSVPForm from '@/components/RSVPForm';
import WeddingCover from '@/components/WeddingCover';
import { Home, Edit, Share, Smartphone, Monitor, X } from 'lucide-react';

interface Event {
  title: string;
  date: Date | string;
  time: string;
  venue: string;
  description?: string;
}

interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  headerStyle: string;
  backgroundImage?: string;
}

interface GalleryConfig {
  spacing: number;
  showCaptions: boolean;
  borderRadius: number;
  effect: GalleryEffect;
}

interface WeddingDisplayProps {
  weddingData: {
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
    themeConfig?: ThemeConfig;
    story?: string;
    gallery?: string[];
    galleryLayout?: GalleryLayout;
    galleryConfig?: GalleryConfig;
    slug: string;
    events?: Event[];
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
  };
  isPreview?: boolean;
  guestName?: string;
}

export default function WeddingDisplay({ weddingData, isPreview = false, guestName }: WeddingDisplayProps) {
  const [showCover, setShowCover] = useState(true);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [contentVisible, setContentVisible] = useState(false);
  
  // Format wedding dates and times
  const weddingDate = new Date(weddingData.date);
  const formattedDate = weddingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Theme defaults if not provided
  const themeConfig = weddingData.themeConfig || {
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    fontFamily: 'Inter',
    headerStyle: 'centered'
  };
  
  // Gallery config defaults if not provided
  const galleryConfig = weddingData.galleryConfig || {
    spacing: 8,
    showCaptions: false,
    borderRadius: 8,
    effect: 'zoom' as GalleryEffect
  };
  
  // Gallery layout default if not provided
  const galleryLayout = weddingData.galleryLayout || 'grid';
  
  // Sample music URL - in a real app, you would get this from the wedding model
  const musicUrl = "https://example.com/sample-music.mp3";

  // Handle opening the invitation (removing the cover)
  const handleOpenInvitation = () => {
    setShowCover(false);
    // Trigger fade-in animation after removing cover
    setTimeout(() => {
      setContentVisible(true);
    }, 100);
  };

  // Determine the container classes based on view mode
  const containerClasses = viewMode === 'mobile' 
    ? "max-w-sm mx-auto border-x border-gray-300 shadow-lg h-[80vh] overflow-y-auto"
    : "";

  // Apply theme styling to the entire content
  const themeStyles = {
    fontFamily: themeConfig.fontFamily || 'Inter',
    '--primary-color': themeConfig.primaryColor,
    '--secondary-color': themeConfig.secondaryColor,
    backgroundImage: themeConfig.backgroundImage ? `url(${themeConfig.backgroundImage})` : 'none',
  } as React.CSSProperties;

  return (
    <>
      {/* Cover Component */}
      {showCover && (
        <WeddingCover 
          brideName={weddingData.brideName}
          groomName={weddingData.groomName}
          date={weddingData.date}
          guestName={guestName}
          coverImage={weddingData.gallery?.[0]}
          onOpen={handleOpenInvitation}
          themeConfig={themeConfig}
        />
      )}
      
      <div 
        className={`min-h-screen transition-opacity duration-700 ease-in-out ${!showCover ? 'block' : 'hidden'} ${contentVisible ? 'opacity-100' : 'opacity-0'}`}
        style={themeStyles}
      >
        {isPreview && (
          <div className="sticky top-0 z-50 bg-amber-500 text-amber-950 text-center py-3 shadow-md">
            <p className="font-semibold text-base">Preview Mode - This is how your wedding invitation will look</p>
            <div className="flex justify-center gap-4 mt-1">
              <Link href="/dashboard" className="text-sm font-medium flex items-center hover:text-amber-800">
                <Home className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
              <Link href={`/dashboard/weddings/${weddingData.slug}/edit`} className="text-sm font-medium flex items-center hover:text-amber-800">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Link>
              <Link href="/dashboard/guest-management/share" className="text-sm font-medium flex items-center hover:text-amber-800">
                <Share className="h-4 w-4 mr-1" />
                Share
              </Link>
              
              {/* View Mode Toggle */}
              <button
                onClick={() => setViewMode(viewMode === 'desktop' ? 'mobile' : 'desktop')}
                className="text-sm font-medium flex items-center hover:text-amber-800"
              >
                {viewMode === 'desktop' ? (
                  <>
                    <Smartphone className="h-4 w-4 mr-1" />
                    Mobile View
                  </>
                ) : (
                  <>
                    <Monitor className="h-4 w-4 mr-1" />
                    Desktop View
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* Main content with conditional mobile wrapper */}
        <div className={containerClasses}>
          {/* Background Music */}
          <MusicPlayer url={musicUrl} />
          
          {/* Hero Section */}
          <section 
            className="relative h-screen flex items-center justify-center"
            style={{
              backgroundColor: themeConfig.primaryColor,
              color: themeConfig.secondaryColor,
            }}
          >
            {weddingData.gallery && weddingData.gallery.length > 0 ? (
              <div className="absolute inset-0 z-0">
                <Image
                  src={weddingData.gallery[0]}
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
              
              {/* Parent Names (if available) */}
              {weddingData.parentNames && (
                <div className="mb-4 text-sm md:text-base">
                  {weddingData.parentNames.bride && (
                    <p className="mb-1">
                      {weddingData.parentNames.bride.father && weddingData.parentNames.bride.mother ? 
                        `${weddingData.parentNames.bride.father} & ${weddingData.parentNames.bride.mother}` : 
                        weddingData.parentNames.bride.father || weddingData.parentNames.bride.mother}
                    </p>
                  )}
                  {weddingData.parentNames.groom && (
                    <p>
                      {weddingData.parentNames.groom.father && weddingData.parentNames.groom.mother ? 
                        `${weddingData.parentNames.groom.father} & ${weddingData.parentNames.groom.mother}` : 
                        weddingData.parentNames.groom.father || weddingData.parentNames.groom.mother}
                    </p>
                  )}
                </div>
              )}
              
              <h1 
                className="text-4xl md:text-6xl mb-4"
                style={{ fontFamily: themeConfig.fontFamily }}
              >
                {weddingData.brideName} <span className="text-2xl md:text-3xl">&</span> {weddingData.groomName}
              </h1>
              <p className="text-xl mb-8">REQUEST THE HONOR OF YOUR PRESENCE</p>
              <div className="text-lg mb-8">
                <p>{formattedDate}</p>
                <p>{weddingData.time}</p>
                <p>{weddingData.venue}, {weddingData.city}</p>
              </div>
              
              <CountdownTimer targetDate={weddingDate} className="mt-8" />
            </div>
          </section>
          
          <div className="container mx-auto px-4 py-16 space-y-24">
            {/* Love Story Section */}
            <section id="story" className="bg-white rounded-lg shadow-lg p-8">
              <LoveStory 
                story={weddingData.story || "Our love story is still being written..."}
                images={weddingData.gallery?.slice(0, 3) || []}
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
                    <p>{weddingData.time}</p>
                    <p className="font-medium mt-4">{weddingData.venue}</p>
                    <p>{weddingData.address}</p>
                    <p>{weddingData.city}, {weddingData.country}</p>
                  </div>
                  
                  {/* Additional Events */}
                  {weddingData.events && weddingData.events.length > 0 && (
                    <div className="mt-8 space-y-8">
                      <Separator />
                      
                      {weddingData.events.map((event, index) => (
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
                  <VenueMap address={`${weddingData.venue}, ${weddingData.address}, ${weddingData.city}, ${weddingData.country}`} />
                </div>
              </div>
            </section>
            
            {/* Photo Gallery Section */}
            {weddingData.gallery && weddingData.gallery.length > 0 && (
              <section id="gallery" className="bg-white rounded-lg shadow-lg p-8">
                <PhotoGallery 
                  images={weddingData.gallery} 
                  layout={galleryLayout as GalleryLayout}
                  config={galleryConfig}
                />
              </section>
            )}
            
            {/* RSVP Section */}
            <section id="rsvp" className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-semibold text-center mb-8">RSVP</h2>
              <RSVPForm weddingId={weddingData._id.toString()} />
            </section>
          </div>
          
          {/* Footer */}
          <footer 
            className="py-6 text-center"
            style={{
              backgroundColor: themeConfig.primaryColor,
              color: themeConfig.secondaryColor,
            }}
          >
            <p className="text-lg mb-2" style={{ fontFamily: themeConfig.fontFamily }}>
              {weddingData.brideName} & {weddingData.groomName}
            </p>
            <p className="text-sm">{formattedDate}</p>
            <p className="text-xs mt-4">Powered by HAJATAN</p>
          </footer>
        </div>
      </div>
    </>
  );
} 