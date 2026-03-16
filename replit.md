# Overview

This project is a pnpm monorepo using TypeScript, designed for Blueprints & Bookkeeping, LLC, a remote bookkeeping, business planning, and advisory firm. The primary goal is to provide a professional online presence, automate client interactions, and manage business operations efficiently.

The project features a React-based frontend and an Express API backend, integrating with various services for payments, contract automation, and document management. It aims to offer a self-service experience for clients while streamlining administrative tasks for the firm.

Key capabilities include:
- A public-facing website detailing services, pricing, client portfolio, and company information.
- Self-service options for clients, including subscription management via Stripe, online intake forms, and a secure document upload portal.
- Automated contract generation and management through Adobe Acrobat Sign.
- Comprehensive SEO features to enhance online visibility.
- A robust backend API built with Express and PostgreSQL using Drizzle ORM for data persistence.
- Newsletter and lead magnet functionality for client engagement.
- Comprehensive analytics, cookie consent, and spam protection measures.

The business vision is to support a growing client base with scalable and automated solutions, emphasizing the firm's expertise in specialized industries like Crypto, Agriculture/Timber, and Tech. The project is designed with a focus on a "dark theme" UI (with light mode toggle), ensuring a modern and professional brand image.

# User Preferences

- **Communication**: I prefer direct and concise language.
- **Workflow**: I want iterative development with clear explanations of changes.
- **Interaction**: Ask before making major architectural changes or introducing new dependencies.
- **Content Policy**: Do NOT offer tax preparation services or include any tax-related content. Degrees listed on the "About" page should be referred to as "coursework" or "studies" only, not "completed degrees." Emphasize the 20-client cap for scarcity. Pricing should always use "starting at" ranges.
- **Coding Standards**: Ensure all code is well-documented and follows TypeScript best practices.
- **Branding**: Do not make changes to the existing branding guidelines, including primary and secondary colors, theme, and font stack, without explicit approval.
- **Header**: The header should ONLY show the BB icon (`public/logo-icon.png`), without any accompanying text.
- **Design System**: The website must adhere to the specified brand guidelines: primary color deep navy (`#1B2A5A`), secondary color periwinkle/accent (`#5B5EA6`), dark theme (with light mode toggle) with glassmorphism cards, gradient text, and glow accents.
- **Contact Info**: The firm's contact information: tea@blueprintsandbookkeeping.com, 541-319-8654.

# System Architecture

The project is structured as a pnpm monorepo, separating deployable applications (`artifacts/`) from shared libraries (`lib/`) and utility scripts (`scripts/`).

- **`artifacts/api-server`**: Express API server handling business logic, database interactions, and external API integrations.
- **`artifacts/website`**: React + Vite frontend for the Blueprints & Bookkeeping public site and client portal.
- **`lib/api-spec`**: Manages OpenAPI specification and codegen for API clients and Zod schemas using Orval.
- **`lib/api-client-react`**: Generated React Query hooks for frontend API interaction.
- **`lib/api-zod`**: Generated Zod schemas for API request/response validation.
- **`lib/db`**: Drizzle ORM setup for PostgreSQL database interactions.
- **`scripts`**: Contains utility scripts for various tasks.

## Frontend (`artifacts/website`)

- **Framework**: React with Vite.
- **Styling**: Tailwind CSS, supplemented with custom CSS for glassmorphism effects and specific branding elements (e.g., `.glass-card`, glow effects, text gradients).
- **Animations**: Framer Motion for interactive UI elements.
- **Routing**: `react-router-dom`.
- **Form Management**: `react-hook-form` with Zod for validation.
- **UI/UX Decisions:**
- **Brand Identity**: Primary color `#1B2A5A` (deep navy), secondary `#5B5EA6` (periwinkle/accent).
- **Design System**: Dark theme with deep navy-black background (plus light mode toggle), glassmorphism cards, gradient text, and glow accents.
- **CSS**: Custom `.glass-card`, `.glass-card-hover`, and Tailwind `@layer utilities` for specific effects like glow-line, glow-dot, text-gradient, and accent-bar.
- **Typography**: Inter (bold) for display, JetBrains Mono for tags.
- **Key Pages**: Home, About, Services, Industries, Pricing, Portfolio, Blog, Contact, Client Portal, Unsubscribe, Welcome, Onboarding, Status, and 404.
- **Navigation**: Header with BB icon (`public/logo-icon.png`) and skip-navigation link, simplified navigation (About, Services, Industries, Pricing, Portfolio, Blog) with ARIA landmarks, and a "Get Started" CTA.
- **SEO**: Comprehensive SEO meta tags (description, keywords, OG, Twitter cards, JSON-LD), `robots.txt`, `sitemap.xml`, and per-page title management.
- **Analytics & Consent**: Plausible Analytics integration with cookie consent banner (Accept/Decline), route tracking, and conversion event tracking.
- **Accessibility**: WCAG 2.1 AA compliant (skip-links, focus-visible styles, ARIA landmarks, heading hierarchy, programmatic labels, role="alert" for errors).
- **Forms**: React Hook Form with Zod for validation, including honeypot spam protection fields.

## Backend (`artifacts/api-server`)

- **Framework**: Express 5.
- **Database ORM**: Drizzle ORM with PostgreSQL.
- **Validation**: Zod for API request and response validation, integrated with `drizzle-zod`.
- **API Codegen**: Orval generates API client and Zod schemas from an OpenAPI spec.
- **Build System**: esbuild for CJS bundling.
- **Core Routes**:
    - `/api/payments`: Stripe checkout session creation, deposit sessions, and webhook handling (checkout.session.completed, invoice.payment_failed, customer.subscription.deleted).
    - `/api/onboarding`: Client intake form submission, triggering Adobe Sign contracts.
    - `/api/contracts`: Adobe Sign integration for contract management (listing, sending, syncing, template management, document download).
    - `/api/documents`: Client document upload, listing, download, and secure link generation.
    - `/api/contact`: General contact form submissions with honeypot rejection and rate limiting.
    - `/api/newsletter`: Newsletter subscription (with signup source tracking) and unsubscription.
- **Spam Protection**: Server-side honeypot rejection in contact and newsletter routes.
- **Self-Service Subscriptions (Stripe)**:
    - One-time deposit payments for Bookkeeping and Business Plan services via Stripe Checkout.
    - Email notifications for subscription and deposit events.
    - Database tables: `subscriptions`, `onboarding_submissions`.
- **Newsletter & Lead Magnet**:
    - Footer newsletter signup.
    - Home page lead magnet ("Financial Readiness Checklist" PDF gated by email).
    - Unsubscribe functionality.
- **Database Schema**: PostgreSQL with Drizzle ORM, including tables for `contact_inquiries`, `newsletter_subscribers`, `contracts`, `contract_templates`, `subscriptions`, `onboarding_submissions`, and `client_documents`.
- **Adobe Acrobat Sign Integration**:
    - Automates contract sending based on form submissions or service bookings (e.g., Mutual NDA, Engagement Letter).
    - Supports Client Engagement Letter, Mutual NDA, Data Processing Agreement, Scope Change/Add-On.
    - Scheduled reminders for unsigned contracts and auto-expiration.
    - Archival of signed PDFs to Adobe Creative Cloud Storage.
    - Admin dashboard for contract management.

## Monorepo Structure and Tooling

- **Package Manager**: pnpm workspaces.
- **Node.js**: Version 24.
- **TypeScript**: Version 5.9, utilizing composite projects and project references for efficient type-checking across packages. `tsc --build --emitDeclarationOnly` is used for type declaration generation.
- **Shared Libraries**:
    - `lib/api-spec`: Contains OpenAPI 3.1 spec and Orval configuration for API codegen.
    - `lib/api-client-react`: Generated React Query hooks for API interaction.
    - `lib/api-zod`: Generated Zod schemas for request/response validation.
    - `lib/db`: Drizzle ORM setup for PostgreSQL, defining all database schemas.

## Client Document Upload Portal

- **Purpose**: Securely upload client financial documents.
- **Features**: Drag-and-drop interface, name/email identification, progress indicators.
- **Validation**: Supports specific file types (PDF, DOCX, XLSX, DOC, XLS, JPG, JPEG, PNG, CSV) and a 25MB per-file limit (max 10 files per upload).
- **Storage**: Files uploaded to Adobe Creative Cloud Storage.
- **Notifications**: Email confirmations to clients and notifications to admins.

## Newsletter & Lead Magnet

- **Footer Newsletter Signup**: Email + subscribe button in footer "Stay in the Loop" section.
- **Lead Magnet**: Gated "Financial Readiness Checklist" PDF download on the home page with email capture and honeypot protection.
- **Subscriber Management**: Stores subscribers with signup source tracking (footer vs lead_magnet).
- **Unsubscribe**: Dedicated /unsubscribe page marks subscribers as inactive.

# External Dependencies

- **PostgreSQL**: Primary database for all application data, managed with Drizzle ORM.
- **Stripe**: For self-service subscriptions (Essentials & Growth tiers) and one-time deposit payments (Bookkeeping & Business Plans), managing checkout sessions, and webhook processing.
    - Environment secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SITE_URL`, `STRIPE_ESSENTIALS_MONTHLY_PRICE_ID`, `STRIPE_ESSENTIALS_ANNUAL_PRICE_ID`, `STRIPE_GROWTH_MONTHLY_PRICE_ID`, `STRIPE_GROWTH_ANNUAL_PRICE_ID`.
- **Adobe Acrobat Sign API v6**: For e-signature workflows, contract automation, and management.
- **Adobe Creative Cloud Storage**: For archiving signed contracts and storing client-uploaded documents.
- **Resend**: For sending email notifications (e.g., subscription events, deposit payments, document upload confirmations).
- **Plausible Analytics**: For privacy-friendly analytics tracking.
- **Calendly**: Potentially integrated for booking webhooks to trigger contract automation.
- **Google Fonts**: Inter and JetBrains Mono for typography.
