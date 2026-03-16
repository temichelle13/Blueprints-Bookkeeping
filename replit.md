# CRITICAL: Read Before Making Any Changes

**Before writing any code, all task agents must read `SITE_CONSTRAINTS.md` at the project root.**
It documents: which third-party services are actually in use (Calendly, NOT Cal.com), what services this business offers (Bookkeeping + Business Plans only — no tax, Digital Handshake is add-on only), credential wording rules, and a list of common mistakes to avoid.

---

# Overview

This project is a pnpm monorepo using TypeScript, designed for Blueprints & Bookkeeping, LLC, a remote bookkeeping, business planning, and advisory firm. The primary goal is to provide a professional online presence, automate client interactions, and manage business operations efficiently.

The project features a React-based frontend and an Express API backend, integrating with various services for payments, contract automation, and document management. It aims to offer a self-service experience for clients while streamlining administrative tasks for the firm.

Key capabilities include:
- A public-facing website detailing services, pricing, client portfolio, and company information.
- Individual service landing pages for Bookkeeping, Business Plans, Digital Handshake, and Notary services.
- Local SEO targeting (Oregon/Roseburg) with dedicated landing pages.
- Self-service options for clients, including subscription management via Stripe, online intake forms, and a secure document upload portal.
- Automated contract generation and management through Adobe Acrobat Sign.
- Comprehensive SEO infrastructure with JSON-LD schemas (LocalBusiness, Service, FAQ, BreadcrumbList), full Open Graph, Twitter Cards, and canonical URLs.
- A robust backend API built with Express and PostgreSQL using Drizzle ORM for data persistence.
- Real-time service status monitoring for API and Database.
- Newsletter and lead magnet functionality for client engagement.
- Comprehensive analytics (Plausible), cookie consent (accessible UI), and honeypot-based form spam protection measures.
- A lightweight CRM dashboard at `/admin` for managing contact inquiries and newsletter subscribers.

The business vision is to support a growing client base with scalable and automated solutions, emphasizing the firm's expertise in specialized industries like Crypto, Agriculture/Timber, and Tech. The project is designed with a focus on a "dark theme" UI (with light mode toggle), ensuring a modern and professional brand image.

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

- **`artifacts/api-server`**: Express API server (Node.js 24, Express 5) handling business logic, database interactions, security headers (Helmet), rate limiting, and external API integrations.
- **`artifacts/website`**: React + Vite frontend for the Blueprints & Bookkeeping public site, client portal, and service status page.
- **`lib/api-spec`**: Manages OpenAPI specification and codegen for API clients and Zod schemas using Orval.
- **`lib/api-client-react`**: Generated React Query hooks for frontend API interaction.
- **`lib/api-zod`**: Generated Zod schemas for API request/response validation.
- **`lib/db`**: Drizzle ORM setup for PostgreSQL database interactions.
- **`scripts`**: Contains utility scripts for various tasks.

## Tech Stack
- **Node.js**: v24
- **TypeScript**: v5.9 (composite projects, project references)
- **API**: Express 5
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod (with `drizzle-zod`)
- **API Codegen**: Orval (from OpenAPI spec)
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Build**: esbuild (for CJS bundle)

## Frontend (`artifacts/website`)

- **Framework**: React with Vite.
- **Styling**: Tailwind CSS, supplemented with custom CSS for glassmorphism effects and specific branding elements (e.g., `.glass-card`, glow effects, text gradients).
- **Animations**: Framer Motion for interactive UI elements.
- **Routing**: `react-router-dom` (with `useRouteAnalytics` hook).
- **Form Management**: `react-hook-form` with Zod for validation, including honeypot spam protection.
- **Key Pages**: Home, About, Services, Industries, Pricing, Portfolio, Blog, Resources, Contact, Client Portal, Unsubscribe, Welcome, Onboarding, Status, PaymentSuccess, and 404.
- **Individual Service Pages**: 
    - `/services/bookkeeping` (Advanced Bookkeeping & Cleanup)
    - `/services/business-plans` (Business Plans & Financial Forecasting)
    - `/services/digital-handshake` (Business plan as website)
    - `/services/notary` (Roseburg, Oregon Notary)
    - `/oregon-bookkeeper` (Local SEO landing page)
- **Resources Library**: `/resources` page with 13 downloadable PDF templates across 4 categories (Bookkeeping, Business Planning, Crypto, Operations). Downloads gated behind email capture modal with session-based unlock. PDFs generated via `scripts/generate-pdfs.mjs` using pdfkit with brand colors and logo.
- **Navigation**: Header with BB icon (`public/logo-icon.png`) and skip-navigation link, simplified navigation (About, Services, Industries, Pricing, Portfolio, Blog, Resources) with ARIA landmarks, and a "Get Started" CTA.
- **Components**: Includes `SEO` (extended), `Breadcrumbs`, `TrustSignals`, `ChatWidget`, `CookieConsent` (accessible UI), `LeadMagnet`, and `NewsletterSignup`.
- **SEO**: Comprehensive SEO meta tags (description, keywords, OG, Twitter cards, JSON-LD), `robots.txt`, `sitemap.xml`, and per-page title management via `usePageTitle()`.
- **Analytics & Consent**: Plausible Analytics integration with cookie consent banner (Accept/Decline), route tracking, and conversion event tracking.
- **Accessibility**: WCAG 2.1 AA compliant (skip-links, focus-visible styles, ARIA landmarks, heading hierarchy, programmatic labels, role="alert" for errors).

## Backend (`artifacts/api-server`)

- **Framework**: Express 5.
- **Database ORM**: Drizzle ORM with PostgreSQL.
- **Validation**: Zod for API request and response validation, integrated with `drizzle-zod`.
- **API Definition**: OpenAPI 3.1.
- **API Codegen**: Orval generates API client and Zod schemas from an OpenAPI spec.
- **Build System**: esbuild for CJS bundling.
- **Security**: 
    - Helmet middleware for HTTP security headers (CSP, HSTS, etc.).
    - Rate limiting on contact endpoint.
    - Tightened CORS (denied by default in production).
- **Core Routes**: 
    - `/api/healthz`: Enhanced health check with database ping and structured JSON status.
    - `/api/payments`: Stripe checkout session creation, deposit sessions, and webhook handling (checkout.session.completed, invoice.payment_failed, customer.subscription.deleted).
    - `/api/onboarding`: Client intake form submission, triggering Adobe Sign contracts.
    - `/api/contracts`: Adobe Sign integration for contract management (listing, sending, syncing, template management, document download).
    - `/api/documents`: Client document upload, listing, download, and secure link generation.
    - `/api/contact`: General contact form submissions with honeypot rejection and rate limiting.
    - `/api/newsletter`: Newsletter subscription (with signup source tracking) and unsubscription.
    - `/api/webhooks/cal`: Cal.com booking webhook handling (signature verification, upsert, notifications).
    - `/api/health`: Health checks for API and database.
- **Spam Protection**: Server-side honeypot rejection in contact and newsletter routes.
- **Self-Service Subscriptions (Stripe)**:
    - One-time deposit payments for Bookkeeping and Business Plan services via Stripe Checkout.
    - Email notifications for subscription and deposit events.
    - Database tables: `subscriptions`, `onboarding_submissions`.
- **Newsletter & Lead Magnet**:
    - Footer newsletter signup.
    - Home page lead magnet ("Financial Readiness Checklist" PDF gated by email).
    - Unsubscribe functionality.
- **File Uploads**: Handles secure client document uploads to Adobe Creative Cloud Storage.
- **Database Schema**: PostgreSQL with Drizzle ORM, including tables for `contact_inquiries`, `newsletter_subscribers`, `contracts`, `contract_templates`, `subscriptions`, `onboarding_submissions`, `client_documents`, and `bookings`.
- **Adobe Acrobat Sign Integration**:
    - Automates contract sending based on form submissions or service bookings (e.g., Mutual NDA, Engagement Letter).
    - Supports Client Engagement Letter, Mutual NDA, Data Processing Agreement, Scope Change/Add-On.

## Database

- **ORM**: Drizzle ORM.
- **Database**: PostgreSQL.
- **Key Tables**:
    - `contact_inquiries`: Stores contact form submissions.
    - `newsletter_subscribers`: Manages newsletter subscriptions.
    - `contracts`: Tracks contract records, statuses, and Adobe Sign integration details.
    - `contract_templates`: Stores references to Adobe Sign templates.
    - `subscriptions`: Records Stripe subscription details.
    - `onboarding_submissions`: Stores client intake form data.
    - `client_documents`: Manages uploaded client documents.
    - `bookings`: Cal.com booking records (calBookingId, clientName, clientEmail, meetingType, startTime, endTime, status, rawPayload).

## Cal.com Scheduling Integration

- **Schedule page** (`/schedule`): Cal.com inline embed showing live availability with three meeting types (Video Call 45 min, Phone Call 30 min, Document-Only Async)
- **Contact page** (`/contact`): "Book a Time Directly" CTA section above the intake forms linking to `/schedule`
- **Webhook**: `POST /api/webhooks/cal` — verifies `X-Cal-Signature-256` HMAC, upserts bookings to `bookings` table, triggers email (Resend) + SMS (Twilio) notifications to owner
- **Environment secrets**: `CAL_WEBHOOK_SECRET`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, `OWNER_PHONE_NUMBER`, `OWNER_EMAIL`, `RESEND_API_KEY`
- **Setup guide**: See `README-SCHEDULING.md` in repo root
- **CTA routing**: All "Get a Quote", "Start Your Blueprint", "Book Your Consultation", "Schedule a Consultation" buttons site-wide now link to `/schedule`

## Contract Automation & Admin Dashboards

- **Integration**: Adobe Acrobat Sign API v6.
- **Contract Functionality**: Automatic generation/sending based on bookings (e.g., Mutual NDA, Engagement Letter), scheduled reminders, auto-expiration, and archival of signed PDFs to Adobe Creative Cloud Storage.
- **Document Portal**: Secure drag-and-drop interface for financial documents (25MB limit, specific file types) with Adobe Creative Cloud Storage backend and admin dashboard for access.
- **Admin Dashboards**:
    - CRM dashboard at `/admin` for viewing/managing contact form inquiries (with status tracking: New/Contacted/In Progress/Closed), newsletter subscriber management, and CSV export.
    - Contract management dashboard.

## Newsletter & Lead Magnet

- **Footer Newsletter Signup**: Email + subscribe button in footer "Stay in the Loop" section.
- **Lead Magnet**: Gated "Financial Readiness Checklist" PDF download on the home page with email capture and honeypot protection.
- **Subscriber Management**: Stores subscribers with signup source tracking (footer vs lead_magnet).
- **Unsubscribe**: Dedicated /unsubscribe page marks subscribers as inactive.
- **PDF Resource**: `scripts/generate-checklist-pdf.mjs` generates the lead magnet PDF.

## Monorepo Structure and Shared Libraries

- **Package Manager**: pnpm workspaces.
- **TypeScript Configuration**: `tsconfig.base.json` with `composite: true` and root `tsconfig.json` with project references ensures correct cross-package type checking and build order. `tsc --build --emitDeclarationOnly` used for type declarations.
- **Shared Libraries**:
    - `lib/api-spec`: Contains OpenAPI 3.1 spec and Orval configuration for API codegen.
    - `lib/api-client-react`: Generated React Query hooks for API interaction.
    - `lib/api-zod`: Generated Zod schemas for request/response validation.
    - `lib/db`: Drizzle ORM setup for PostgreSQL, defining all database schemas.

# External Dependencies

- **PostgreSQL**: Primary database for all application data, managed with Drizzle ORM.
- **Stripe**: For self-service subscriptions (Essentials & Growth tiers) and one-time deposit payments (Bookkeeping & Business Plans), managing checkout sessions, and webhook processing.
    - Environment secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SITE_URL`, etc.
- **Adobe Acrobat Sign API v6**: For e-signature workflows, contract automation, and management.
- **Adobe Creative Cloud Storage**: For archiving signed contracts and storing client-uploaded documents.
- **Resend**: For sending email notifications (e.g., subscription events, deposit payments, document upload confirmations).
- **Plausible Analytics**: For privacy-friendly analytics tracking (integrated via VITE_ANALYTICS_ID).
- **Calendly**: Integrated for booking webhooks to trigger contract automation.
- **Google Fonts**: Inter and JetBrains Mono for typography.
- **Orval**: For generating client SDKs and Zod schemas from OpenAPI specifications.
- **React Query**: Used in the frontend for data fetching, caching, and state management.
