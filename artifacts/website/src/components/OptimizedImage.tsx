import type { ImgHTMLAttributes } from "react";

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

/**
 * Optimized image component that automatically uses WebP with PNG fallback
 * Assumes WebP version exists at same path with .webp extension
 */
export function OptimizedImage({ src, alt, ...props }: OptimizedImageProps) {
  // Only generate a WebP source when the original image is a PNG
  const isPng = /\.png$/i.test(src);
  const webpSrc = isPng ? src.replace(/\.png$/i, ".webp") : undefined;

  return (
    <picture>
      {isPng && webpSrc && <source srcSet={webpSrc} type="image/webp" />}
      <img src={src} alt={alt} {...props} />
    </picture>
  );
}
