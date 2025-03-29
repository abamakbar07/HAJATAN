import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  url: string;
  autoplay?: boolean;
  className?: string;
}

export default function MusicPlayer({ url, autoplay = true, className }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(url);
    audioRef.current.loop = true;
    
    // Set up event listeners
    const handleEnded = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => console.error('Audio playback failed:', err));
      }
    };
    
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleEnded);
    }
    
    // Start playing if autoplay is enabled
    if (autoplay && audioRef.current) {
      // We need to interact with the document first due to browser autoplay policies
      const unlockAudio = () => {
        if (audioRef.current) {
          audioRef.current.play().catch(err => console.error('Audio playback failed:', err));
          document.removeEventListener('click', unlockAudio);
        }
      };
      
      document.addEventListener('click', unlockAudio, { once: true });
    }
    
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [url, autoplay]);
  
  // Toggle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error('Audio playback failed:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Button 
        size="icon" 
        variant="secondary" 
        className="rounded-full h-12 w-12 shadow-lg"
        onClick={togglePlay}
      >
        {isPlaying ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
      </Button>
    </div>
  );
} 