'use client';

import Image from 'next/image';
import { useState } from 'react';

interface LogoBackgroundProps {
  opacity?: number;
  className?: string;
}

export default function LogoBackground({ opacity = 5, className = '' }: LogoBackgroundProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return null; // Gracefully fail if image doesn't load
  }

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity: opacity / 100 }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/Gemini_Generated_Image_f6yqiyf6yqiyf6yq.png"
          alt="Acadence Logo"
          width={800}
          height={800}
          className="object-contain w-full h-full max-w-4xl max-h-4xl"
          priority={false}
          quality={30}
          onError={() => setImageError(true)}
          style={{
            filter: 'grayscale(100%)',
          }}
        />
      </div>
    </div>
  );
}
