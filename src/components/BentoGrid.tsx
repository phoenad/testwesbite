import { useEffect, useState } from 'react';

interface BentoGridProps {
  images: string[];
}

export function BentoGrid({ images }: BentoGridProps) {
  const [shuffledImages, setShuffledImages] = useState<string[]>([]);

  // Bento box size patterns - mix of big (2x2), wide (2x1), tall (1x2), and regular (1x1)
  const layoutPattern = [
    'bento-big', 'bento-regular', 'bento-regular', 'bento-wide', 'bento-regular', 'bento-regular',
    'bento-regular', 'bento-tall', 'bento-regular', 'bento-regular', 'bento-regular', 'bento-tall',
    'bento-wide', 'bento-regular', 'bento-big', 'bento-regular', 'bento-regular',
    'bento-regular', 'bento-regular', 'bento-regular', 'bento-wide', 'bento-regular', 'bento-regular',
    'bento-tall', 'bento-big', 'bento-regular', 'bento-regular', 'bento-tall',
    'bento-regular', 'bento-regular', 'bento-wide', 'bento-regular', 'bento-regular',
    'bento-regular', 'bento-regular', 'bento-regular', 'bento-tall', 'bento-wide', 'bento-regular',
    'bento-big', 'bento-regular', 'bento-regular', 'bento-regular', 'bento-tall'
  ];

  useEffect(() => {
    // Shuffle images for variety
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
  }, [images]);

  return (
    <div className="fixed inset-0 w-full h-full z-0">
      <div className="bento-grid">
        {layoutPattern.map((sizeClass, index) => (
          <div key={index} className={`bento-item ${sizeClass}`}>
            <img
              src={shuffledImages[index % shuffledImages.length] || images[0]}
              alt="G MONAD Community"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Overlay gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.3), rgba(0,0,0,0.4))',
          backdropFilter: 'blur(2px)'
        }}
      />
    </div>
  );
}
