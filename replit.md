# Overview

This project is a pnpm monorepo using TypeScript, designed for Blueprints & Bookkeeping, LLC, a remote bookkeeping, business planning, and advisory firm. The primary goal is to create a professional online presence, automate client onboarding, contract management, and provide secure document uploads.

The project includes a React-based frontend with a dark theme and glassmorphism elements, an Express API server, and integrations with external services like Stripe for subscriptions and Adobe Acrobat Sign for e-signatures. It aims to streamline operations for the firm, enhance client experience, and manage business growth efficiently. The firm is capped at 20 active clients, emphasizing scarcity and exclusivity.

Key capabilities include:
- A public-facing website detailing services, pricing, and client portfolio.
- Secure client portal for document uploads and onboarding.
- Automated contract generation and management via Adobe Sign.
- Stripe integration for self-service subscription payments.
- SEO optimization for discoverability.
- Newsletter and lead magnet functionality for client engagement.
- Integration with a PostgreSQL database using Drizzle ORM for data persistence.

# User Preferences

- **Communication**: I prefer direct and concise language.
- **Workflow**: I want iterative development with clear explanations of changes.
- **Interaction**: Ask before making major architectural changes or introducing new dependencies.
- **Content Policy**: Do NOT offer tax preparation services or include any tax-related content. Degrees listed on the "About" page should be referred to as "coursework" or "studies" only, not "completed degrees." Emphasize the 20-client cap for scarcity. Pricing should always use "starting at" ranges.
- **Coding Standards**: Ensure all code is well-documented and follows TypeScript best practices.
- **Branding**: Do not make changes to the existing branding guidelines, including primary and secondary colors, theme, and font stack, without explicit approval.

# System Architecture

## Monorepo Structure

The project is organized as a pnpm workspace monorepo with separate `artifacts` (deployable applications) and `lib` (shared libraries) directories.
- **`artifacts/api-server`**: Express API server handling business logic, database interactions, and external API integrations.
- **`artifacts/website`**: React + Vite frontend for the Blueprints & Bookkeeping public site and client portal.
- **`lib/api-spec`**: Manages OpenAPI specification and codegen for API clients and Zod schemas using Orval.
- **`lib/api-client-react`**: Generated React Query hooks for frontend API interaction.
- **`lib/api-zod`**: Generated Zod schemas for API request/response validation.
- **`lib/db`**: Drizzle ORM setup for PostgreSQL database interactions.
- **`scripts`**: Contains utility scripts for various tasks.

## Frontend (Website)

- **Technology Stack**: React, Vite, Tailwind CSS, Framer Motion.
- **Design System**: Dark theme with deep navy-black background, glassmorphism cards, gradient text, and glow accents.
- **Branding**: Primary color: `#1B2A5A` (deep navy), Secondary color: `#5B5EA6` (periwinkle).
- **Styling**: Custom CSS utilities for glassmorphism, glow effects, text gradients, and accent bars.
- **Typography**: Inter (bold) for display, JetBrains Mono for tags.
- **Key Pages**: Home, About, Services, Industries, Pricing, Portfolio, Blog, Contact, Client Portal, Unsubscribe, Welcome, Onboarding, and 404.
- **Navigation**: Header with BB icon (`public/logo-icon.png`), simplified navigation (About, Services, Industries, Pricing, Portfolio, Blog), and a "Get Started" CTA.
- **SEO**: Comprehensive SEO meta tags (description, keywords, OG, Twitter cards, JSON-LD), `robots.txt`, `sitemap.xml`, and per-page title management.
- **Forms**: React Hook Form with Zod for validation.

## Backend (API Server)

- **Framework**: Express 5.
- **Data Validation**: Zod.
- **API Definition**: OpenAPI 3.1.
- **Core Routes**: Health checks, contact form submissions, newsletter management, contract management, payment processing (Stripe webhooks), and client onboarding.
- **File Uploads**: Handles secure client document uploads.

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

## Contract Automation

- **Integration**: Adobe Acrobat Sign API v6.
- **Functionality**:
    - Automatic contract generation and sending based on form submissions or service bookings (e.g., Mutual NDA, Engagement Letter, Data Processing Agreement, Scope Change).
    - Scheduled reminders for unsigned contracts and auto-expiration.
    - Archival of signed PDFs to Adobe Creative Cloud Storage.
    - Admin dashboard for contract management.

## Client Document Upload Portal

- **Purpose**: Securely upload client financial documents.
- **Features**: Drag-and-drop interface, name/email identification, progress indicators.
- **Validation**: Supports specific file types (PDF, DOCX, XLSX, JPG, PNG, CSV) and a 25MB per-file limit (max 10 files per upload).
- **Storage**: Files uploaded to Adobe Creative Cloud Storage.
- **Notifications**: Email confirmations to clients and notifications to admins.
- **Admin Features**: Listing, downloading, and secure link generation for client uploads.

## Newsletter & Lead Magnet

- **Footer Newsletter Signup**: Email + subscribe button in footer "Stay in the Loop" section.
- **Lead Magnet**: Gated "Financial Readiness Checklist" PDF download on the home page with email capture.
- **Subscriber Management**: Stores subscribers with signup source tracking (footer vs lead_magnet).
- **Unsubscribe**: Dedicated /unsubscribe page marks subscribers as inactive.
- **PDF Resource**: `scripts/generate-checklist-pdf.mjs` generates the lead magnet PDF.

## TypeScript Configuration

- **Monorepo Typechecking**: `tsconfig.base.json` with `composite: true` and root `tsconfig.json` with project references ensures correct cross-package type checking and build order.
- **Build Process**: `tsc --build --emitDeclarationOnly` for type declarations; actual JS bundling via esbuild, Vite, or tsx.

# External Dependencies

- **Stripe**: For self-service subscriptions (Essentials & Growth tiers), managing checkout sessions, and webhook processing.
    - Environment secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SITE_URL`, `STRIPE_ESSENTIALS_MONTHLY_PRICE_ID`, `STRIPE_ESSENTIALS_ANNUAL_PRICE_ID`, `STRIPE_GROWTH_MONTHLY_PRICE_ID`, `STRIPE_GROWTH_ANNUAL_PRICE_ID`.
- **Adobe Acrobat Sign API v6**: For e-signature workflows, contract automation, and management.
    - Environment secrets: `ADOBE_SIGN_CLIENT_ID`, `ADOBE_SIGN_CLIENT_SECRET`, `ADOBE_SIGN_REFRESH_TOKEN`.
- **Adobe Creative Cloud Storage**: For archiving signed contracts and storing client-uploaded documents.
- **PostgreSQL**: Primary database for all application data, managed with Drizzle ORM.
- **Resend**: For sending email notifications (e.g., subscription events, document upload confirmations).
- **Calendly**: Potentially integrated for booking webhooks to trigger contract automation.
- **Google Fonts**: Inter and JetBrains Mono for typography.
