'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageWithBlurProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  aspectRatio?: string;
}

export function ImageWithBlur({
  src,
  alt,
  width,
  height,
  className,
  fill,
  priority = false,
  sizes,
  aspectRatio,
}: ImageWithBlurProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        aspectRatio && `aspect-[${aspectRatio}]`,
        fill && 'h-full w-full',
        className
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-savanna animate-pulse"
          aria-hidden="true"
        />
      )}

      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        sizes={sizes}
        className={cn(
          'object-cover transition-opacity duration-500',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
