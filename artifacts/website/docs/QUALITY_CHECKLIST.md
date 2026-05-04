# Website Quality & Deployment Checklist

This checklist ensures the website maintains high quality, performance, and deployability.

## Pre-Deployment Checks

Run these commands before any deployment:

```bash
# 1. Check for merge conflicts
pnpm run check:merge-conflicts

# 2. Type check all code
pnpm run typecheck

# 3. Validate full deployment pipeline
pnpm run check:website-deploy

# 4. Build website locally to verify
pnpm --filter @workspace/website build
```

## Quality Standards

### ✅ Content Quality

- [ ] No spelling or grammar errors in user-facing text
- [ ] Professional tone throughout
- [ ] Clear, concise copy (no run-on sentences >150 words)
- [ ] Consistent terminology

### ✅ Layout & UX

- [ ] No duplicate CTAs on same page (max 2: primary + secondary)
- [ ] Clear visual hierarchy
- [ ] Consistent spacing and alignment
- [ ] Mobile responsive (test at 375px, 768px, 1024px, 1440px)
- [ ] No overlapping elements
- [ ] Readable font sizes (min 14px body text)

### ✅ Performance

- [ ] Images optimized (WebP for all PNGs >100KB)
- [ ] Critical images use `fetchPriority="high"` (hero only)
- [ ] Below-fold images use `loading="lazy"`
- [ ] Large libraries lazy-loaded when possible
- [ ] No render-blocking resources
- [ ] Total page weight <3MB
- [ ] LCP (Largest Contentful Paint) <2.5s
- [ ] CLS (Cumulative Layout Shift) <0.1

### ✅ SEO & Accessibility

- [ ] All images have meaningful `alt` text
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Meta descriptions <160 characters
- [ ] Sitemap generated and up-to-date
- [ ] No broken internal links
- [ ] ARIA labels on interactive elements

### ✅ Code Quality

- [ ] No merge conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
- [ ] No TypeScript errors
- [ ] No console.log statements in production code
- [ ] No hardcoded secrets or API keys
- [ ] Consistent code formatting (Prettier)

### ✅ Build & Deploy

- [ ] Build completes without errors
- [ ] No build warnings about large chunks (>500KB)
- [ ] Deployment validation passes
- [ ] Environment variables properly configured

## Performance Budgets

| Metric            | Target | Critical |
| ----------------- | ------ | -------- |
| Initial Bundle    | <200KB | <300KB   |
| Total JS          | <500KB | <800KB   |
| Total CSS         | <50KB  | <100KB   |
| Images (per page) | <1MB   | <2MB     |
| LCP               | <2.0s  | <2.5s    |
| FID               | <100ms | <300ms   |
| CLS               | <0.05  | <0.1     |

## Common Issues & Fixes

### Issue: "Unreadable text" or "Messy layout"

**Fix:**

1. Break up paragraphs >150 words
2. Remove duplicate CTAs
3. Simplify complex sections
4. Add whitespace between sections

### Issue: "Slow page load" or "Garbage speed"

**Fix:**

1. Run image optimization: `node artifacts/website/scripts/convert-images-to-webp.cjs`
2. Check bundle size in build output
3. Lazy-load heavy components
4. Use OptimizedImage component for large images

### Issue: "Deployment fails"

**Fix:**

1. Run `pnpm run check:merge-conflicts`
2. Run `pnpm run typecheck`
3. Fix any errors found
4. Commit and push fixes

### Issue: "Build warnings about chunk size"

**Fix:**

1. Check vite.config.ts manualChunks configuration
2. Consider lazy-loading large dependencies
3. Review if all dependencies are necessary

## Monitoring

After deployment, verify:

- [ ] Homepage loads in <3 seconds
- [ ] All CTAs work correctly
- [ ] Forms submit successfully
- [ ] Mobile layout looks correct
- [ ] No console errors

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Image Optimization Guide](./IMAGE_OPTIMIZATION.md)
