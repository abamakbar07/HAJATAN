import { useMemo } from 'react';

interface VenueMapProps {
  address: string;
  className?: string;
}

export default function VenueMap({ address, className }: VenueMapProps) {
  const encodedAddress = useMemo(() => encodeURIComponent(address), [address]);
  
  return (
    <div className={`w-full h-96 rounded-lg overflow-hidden shadow-md ${className}`}>
      <iframe
        title="Wedding Venue"
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodedAddress}`}
        allowFullScreen
      />
    </div>
  );
} 