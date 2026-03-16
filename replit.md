# Overview

This project is a pnpm monorepo using TypeScript, designed for Blueprints & Bookkeeping, LLC, a remote bookkeeping, business planning, and advisory firm. The primary goal is to provide a professional online presence, automate client interactions, and manage business operations efficiently.

The project features a React-based frontend and an Express API backend, integrating with various services for payments, contract automation, and document management. It aims to offer a self-service experience for clients while streamlining administrative tasks for the firm.

Key capabilities include:
- A public-facing website detailing services, pricing, client portfolio, and company information.
- Individual service landing pages for Bookkeeping, Business Plans, Digital Handshake, and Notary services, with local SEO targeting.
- Self-service options for clients, including subscription management via Stripe, online intake forms, and a secure document upload portal.
- Automated contract generation and management through Adobe Acrobat Sign.
- Comprehensive SEO infrastructure with JSON-LD schemas, Open Graph, Twitter Cards, and canonical URLs.
- A robust backend API built with Express and PostgreSQL using Drizzle ORM.
- Newsletter and lead magnet functionality.
- Comprehensive analytics, cookie consent, and honeypot-based form spam protection.
- A lightweight CRM dashboard at `/admin` for managing contact inquiries and newsletter subscribers.

The business vision is to support a growing client base with scalable and automated solutions, emphasizing the firm's expertise in specialized industries like Crypto, Agriculture/Timber, and Tech. The project is designed with a focus on a "dark theme" UI with a light mode toggle, ensuring a modern and professional brand image.

# User Preferences

- **Communication**: I prefer direct and concise language.
- **Workflow**: I want iterative development with clear explanations of changes.
- **Interaction**: Ask before making major architectural changes or introducing new dependencies.
- **Content Policy**: Do NOT offer tax preparation services or include any tax-related content. Degrees listed on the "About" page should be referred to as "coursework" or "studies" only, not "completed degrees." Professional certifications (CEH v12, QB ProAdvisor Advanced, Crypto Tax Certified, OR Notary RON) are earned. Emphasize the 20-client cap for scarcity. Pricing should always use "starting at" ranges.
- **Coding Standards**: Ensure all code is well-documented and follows TypeScript best practices.
- **Branding**: Do not make changes to the existing branding guidelines, including primary and secondary colors (#1B2A5A deep navy, #5B5EA6 periwinkle), theme, and font stack, without explicit approval.
- **Header**: The header should ONLY show the BB icon (`public/logo-icon.png`), without any accompanying text. Nav: About, Services, Industries, Pricing, Portfolio, Blog, Resources + "Get Started" CTA.
- **Design System**: 
    - Primary color (deep navy): `#1B2A5A`
    - Secondary color (periwinkle/accent): `#5B5EA6`
    - Theme: Dark — deep navy-black background (with light mode toggle), glassmorphism cards, gradient text, and glow accents.
    - CSS: Custom `.glass-card` and `.glass-card-hover` in plain CSS (Tailwind v4 compatible). `@layer utilities` for glow-line, glow-dot, text-gradient, accent-bar.
    - Font stack: Display font (Inter bold), JetBrains Mono for tags.
- **Contact Info**: The firm's contact information: tea@blueprintsandbookkeeping.com, 541-319-8654.
- **SEO & Performance**:
    - `index.html`: meta description, keywords, OG tags, Twitter cards, canonical URL, JSON-LD (ProfessionalService schema).
    - Extended SEO component with support for JSON-LD (LocalBusiness, Service, FAQ, BreadcrumbList), full Open Graph, and Twitter Card meta tags.
    - `public/robots.txt` and `public/sitemap.xml` (includes all pages, blog posts, and individual service URLs).
    - Per-page titles via `usePageTitle()` hook.
    - Core Web Vitals optimization: explicit image dimensions, lazy loading, and fetchPriority="high" for hero images.

# System Architecture

The project is structured as a pnpm monorepo, separating deployable applications (`artifacts/`) from shared libraries (`lib/`) and utility scripts (`scripts/`).

**Tech Stack**:
- **Node.js**: v24
- **TypeScript**: v5.9 (composite projects, project references)
- **API**: Express 5
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod (with `drizzle-zod`)
- **API Codegen**: Orval (from OpenAPI spec)
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Build**: esbuild (for CJS bundle)

**Frontend (`artifacts/website`)**:
- **Framework**: React with Vite.
- **Styling**: Tailwind CSS with custom glassmorphism and branding effects.
- **Animations**: Framer Motion.
- **Form Management**: `react-hook-form` with Zod for validation, including honeypot spam protection.
- **Key Features**: Comprehensive SEO component, accessible components (e.g., `CookieConsent`), analytics integration, and a resource library with gated content.
- **Accessibility**: WCAG 2.1 AA compliant.

**Backend (`artifacts/api-server`)**:
- **Framework**: Express 5.
- **Database ORM**: Drizzle ORM with PostgreSQL.
- **Validation**: Zod for API request/response validation.
- **API Definition**: OpenAPI 3.1, with Orval for client and schema generation.
- **Security**: Helmet middleware, rate limiting, tightened CORS, and server-side honeypot protection.
- **Core Routes**:
    - `/api/healthz`: Health check.
    - `/api/payments`: Stripe integration for checkout and webhooks.
    - `/api/onboarding`: Client intake and contract triggering.
    - `/api/contracts`: Adobe Sign integration.
    - `/api/documents`: Secure client document management.
    - `/api/contact`, `/api/newsletter`: Form submissions and subscriptions.
    - `/api/webhooks/cal`: Cal.com booking webhook handling.
- **Self-Service Subscriptions**: Handles Stripe deposit payments and subscription events.
- **File Uploads**: Secure client document uploads to Adobe Creative Cloud Storage.
- **Database Schema**: PostgreSQL with Drizzle ORM, managing `contact_inquiries`, `newsletter_subscribers`, `contracts`, `subscriptions`, `onboarding_submissions`, `client_documents`, and `bookings`.

**Cal.com Scheduling Integration**:
- **Frontend**: `/schedule` page with Cal.com inline embed.
- **Backend**: `POST /api/webhooks/cal` for booking data processing, notifications (email via Resend, SMS via Twilio).

**Contract Automation & Admin Dashboards**:
- **Integration**: Adobe Acrobat Sign API v6 for automatic contract generation, sending, and archiving to Adobe Creative Cloud Storage.
- **Document Portal**: Secure drag-and-drop interface for financial documents.
- **Admin Dashboards**: CRM dashboard at `/admin` for inquiries, newsletter subscribers, and contract management.

**Newsletter & Lead Magnet**:
- **Signup**: Footer newsletter signup and home page lead magnet (gated PDF download).
- **Management**: Tracks subscribers and their source, with unsubscribe functionality.

**Monorepo Structure and Shared Libraries**:
- **Package Manager**: pnpm workspaces.
- **TypeScript Configuration**: `composite: true` with project references.
- **Shared Libraries**: `lib/api-spec` (OpenAPI), `lib/api-client-react` (generated React Query hooks), `lib/api-zod` (generated Zod schemas), `lib/db` (Drizzle ORM setup).

# External Dependencies

- **PostgreSQL**: Primary database.
- **Stripe**: For self-service subscriptions, one-time payments, and webhook processing.
- **Adobe Acrobat Sign API v6**: For e-signature workflows and contract automation.
- **Adobe Creative Cloud Storage**: For archiving signed contracts and storing client documents.
- **Resend**: For sending email notifications.
- **Plausible Analytics**: For privacy-friendly analytics tracking.
- **Calendly**: Integrated for booking webhooks.
- **Google Fonts**: Inter and JetBrains Mono.
- **Orval**: For generating client SDKs and Zod schemas.
- **React Query**: Frontend data fetching and state management.