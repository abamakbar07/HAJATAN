import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LoveStoryProps {
  story: string;
  images?: string[];
  className?: string;
}

export default function LoveStory({ story, images = [], className }: LoveStoryProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <h2 className="text-3xl font-semibold text-center">Our Love Story</h2>
      
      <div className="prose max-w-none">
        {story.split('\n').map((paragraph, index) => (
          <p key={index} className="text-lg leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {images && images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square overflow-hidden rounded-md">
              <Image
                src={image}
                alt={`Couple photo ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 