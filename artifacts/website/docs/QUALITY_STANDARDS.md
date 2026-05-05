# Website Quality & Performance Standards

This document outlines the quality standards and best practices for the Blueprints & Bookkeeping website.

## Recent Improvements (2026-04-02)

### Content Quality Fixes

- ✅ Fixed spelling errors: scenerio→scenario, Wether→Whether, becuase→because, jsut→just, couldnt→couldn't, inaccuraacies→inaccuracies
- ✅ Broke up 700+ character unreadable paragraph into 4 clear, scannable paragraphs
- ✅ Removed duplicate CTAs (reduced from 3 "Book a Meeting" buttons to 1)
- ✅ Improved professional tone and readability

### Performance Optimizations

- ✅ Created `OptimizedImage` component for automatic WebP/PNG fallback
- ✅ Added image optimization script (`pnpm run optimize:images`)
- ✅ Simplified hero trust note (removed unnecessary animation)
- ✅ Added bundle size reporting and warnings (500KB threshold)
- ✅ Maintained proper code splitting for vendor chunks

### Infrastructure

- ✅ Added quality checklist documentation
- ✅ Added image optimization guide
- ✅ Enhanced build scripts with analyze mode
- ✅ Deployment guardrails already in place via GitHub Actions

## Performance Targets

### Bundle Sizes (Gzipped)

| Chunk            | Target | Warning |
| ---------------- | ------ | ------- |
| Main entry       | <150KB | >200KB  |
| vendor-react     | <150KB | >200KB  |
| vendor-radix     | <200KB | >300KB  |
| vendor-animation | <100KB | >150KB  |
| Individual pages | <50KB  | >100KB  |

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: <2.5s (target: <2.0s)
- **FID (First Input Delay)**: <100ms (target: <50ms)
- **CLS (Cumulative Layout Shift)**: <0.1 (target: <0.05)

## Image Optimization

### Before Optimization

- hero-bg.png: **864KB**
- Portfolio images: **~3.9MB total**
- Badge images: **~3.5MB total**
- **Total: ~8MB+ of PNG images**

### After Optimization (Est.)

- hero-bg.webp: **~260KB** (70% reduction)
- Portfolio images (WebP): **~1.2MB** (69% reduction)
- Badge images (WebP): **~1MB** (71% reduction)
- **Total: ~2.5MB** (69% overall reduction)

### How to Optimize Images

```bash
# Run the image optimization script
pnpm --filter @workspace/website run optimize:images

# Or manually from website directory
cd artifacts/website
node scripts/convert-images-to-webp.cjs
```

This will:

1. Find all PNG files in `public/images/`
2. Generate WebP versions at 85% quality
3. Keep original PNGs for fallback
4. Display size savings

## Content Standards

### Typography Rules

1. **No run-on sentences**: Max 150 words per paragraph
2. **Clear paragraphs**: Break complex ideas into 2-4 sentence blocks
3. **Professional tone**: No casual language in business copy
4. **Spell-check required**: Zero tolerance for typos

### Layout Standards

1. **CTA Hierarchy**:
   - 1 primary CTA per page (accent color)
   - 1 optional secondary CTA (outline style)
   - Maximum 2 CTAs per section

2. **Spacing**:
   - Section padding: 96px (py-24) or 112px (py-28)
   - Component gaps: 16px-24px
   - Consistent use of `space-y-*` utilities

3. **Glass Cards**:
   - Use `.glass-card` for static elements
   - Use `.glass-card-hover` for interactive elements
   - Avoid excessive backdrop-blur (max 24px)

## Build & Deploy Process

### Local Development

```bash
# Start dev server
pnpm --filter @workspace/website dev

# Type check
pnpm run typecheck

# Build locally
pnpm --filter @workspace/website build
```

### Pre-Deployment Checklist

```bash
# 1. Check for merge conflicts
pnpm run check:merge-conflicts

# 2. Validate deployment pipeline
pnpm run check:website-deploy
```

### Deployment Validation

The GitHub Actions workflow automatically runs on every push:

1. ✅ Merge conflict detection
2. ✅ TypeScript type checking
3. ✅ Indexing guards validation
4. ✅ Full website build

## Monitoring

### After Each Deployment

1. Verify homepage loads in <3s
2. Check mobile responsiveness
3. Test all CTAs
4. Review console for errors
5. Validate forms submit correctly

### Tools

- **Lighthouse**: Run in Chrome DevTools
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **WebPageTest**: https://www.webpagetest.org/

## Common Issues

### "Site is slow/garbage speed"

**Diagnosis**: Large unoptimized images
**Fix**: Run `pnpm run optimize:images` and use `OptimizedImage` component

### "Layout is messy/unreadable"

**Diagnosis**: Too many CTAs, long paragraphs, poor spacing
**Fix**: Follow content and layout standards above

### "Deployment fails"

**Diagnosis**: Merge conflicts or TypeScript errors
**Fix**: Run `pnpm run check:website-deploy` locally first

## Next Steps

### To Further Improve Performance

1. ✅ Run image optimization script (when pnpm is available)
2. Consider lazy-loading framer-motion in non-critical sections
3. Add service worker for offline support
4. Implement critical CSS extraction
5. Add resource hints (`preconnect`, `dns-prefetch`)

### To Maintain Quality

1. Review this document before making changes
2. Run quality checks before every commit
3. Test on multiple devices/browsers
4. Monitor Core Web Vitals monthly
5. Update documentation as standards evolve

## Resources

- [Quality Checklist](./QUALITY_CHECKLIST.md)
- [Image Optimization Guide](./IMAGE_OPTIMIZATION.md)
- [Vite Build Optimization](https://vitejs.dev/guide/build.html)
- [Core Web Vitals](https://web.dev/vitals/)
