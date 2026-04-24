# Image Optimization Guide

## Overview
This repository includes tools to optimize images for better website performance. All PNG images should have WebP equivalents for modern browsers.

## Converting Images to WebP

### Automated Conversion
Run the conversion script to convert all PNG images to WebP format:

```bash
# From the root directory
node artifacts/website/scripts/convert-images-to-webp.cjs
```

This script will:
- Find all PNG files in `artifacts/website/public/images/`
- Convert them to WebP format with 85% quality
- Display file size savings for each conversion
- Preserve original PNG files for fallback support

### Manual Conversion
If you need to convert images manually, use Sharp:

```bash
# Install sharp if not already installed
pnpm install sharp

# Convert a single image
node -e "require('sharp')('input.png').webp({quality:85,effort:6}).toFile('input.webp')"
```

## Using OptimizedImage Component

The `OptimizedImage` component automatically serves WebP with PNG fallback:

```tsx
import { OptimizedImage } from '@/components/OptimizedImage';

<OptimizedImage
  src="/images/hero-bg.png"
  alt="Description"
  width={1920}
  height={1080}
  className="w-full h-full object-cover"
  fetchPriority="high"
/>
```

This generates:
```html
<picture>
  <source srcSet="/images/hero-bg.webp" type="image/webp" />
  <img src="/images/hero-bg.png" alt="Description" ... />
</picture>
```

## Performance Impact

Expected savings from WebP conversion:
- **hero-bg.png**: 864KB → ~260KB (70% reduction)
- **Badge images**: 3.5MB+ → ~1MB (71% reduction)
- **Portfolio images**: 3.9MB → ~1.2MB (69% reduction)

Total estimated savings: **7MB+ → 2MB** (71% smaller)

## Best Practices

1. **Always generate WebP** for new PNG images
2. **Keep PNG files** as fallback for older browsers
3. **Use OptimizedImage** component for all large images
4. **Set loading="lazy"** for below-the-fold images
5. **Use fetchPriority="high"** only for hero/LCP images
