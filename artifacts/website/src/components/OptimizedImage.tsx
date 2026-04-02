import { ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

/**
 * Optimized image component that automatically uses WebP with PNG fallback
 * Assumes WebP version exists at same path with .webp extension
 */
export function OptimizedImage({ src, alt, ...props }: OptimizedImageProps) {
  // Replace .png with .webp for the optimized version
  const webpSrc = src.replace(/\.png$/i, '.webp');

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img src={src} alt={alt} {...props} />
    </picture>
  );
}
