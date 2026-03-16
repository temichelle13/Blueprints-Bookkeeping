# Overview

This project is a pnpm monorepo using TypeScript, designed for Blueprints & Bookkeeping, LLC, a remote bookkeeping, business planning, and advisory firm. The primary goal is to provide a professional online presence, automate client interactions, and manage core business processes.

Key capabilities include:
- A public-facing website detailing services, pricing, and company information.
- Self-service options for clients, including subscription management via Stripe, online intake forms, and a secure document upload portal.
- Automated contract generation and management through Adobe Acrobat Sign.
- Comprehensive SEO features to enhance online visibility.
- A robust backend API built with Express and PostgreSQL.

The project aims to streamline operations for Blueprints & Bookkeeping, LLC, enhance client experience, and support business growth.

# User Preferences

- **Communication**: I prefer direct and concise language.
- **Workflow**: I want iterative development with clear explanations of changes.
- **Interaction**: Ask before making major architectural changes or introducing new dependencies.
- **Content Policy**: Do NOT offer tax preparation services or include any tax-related content. Degrees listed on the "About" page should be referred to as "coursework" or "studies" only, not "completed degrees." Emphasize the 20-client cap for scarcity. Pricing should always use "starting at" ranges.
- **Coding Standards**: Ensure all code is well-documented and follows TypeScript best practices.
- **Branding**: Do not make changes to the existing branding guidelines, including primary and secondary colors, theme, and font stack, without explicit approval.

# System Architecture

The project is organized as a pnpm workspace monorepo with separate `artifacts` (deployable applications) and `lib` (shared libraries) directories.
- **`artifacts/api-server`**: Express API server handling business logic, database interactions, and external API integrations.
- **`artifacts/website`**: React + Vite frontend for the Blueprints & Bookkeeping public site and client portal.
- **`lib/api-spec`**: Manages OpenAPI specification and codegen for API clients and Zod schemas using Orval.
- **`lib/api-client-react`**: Generated React Query hooks for frontend API interaction.
- **`lib/api-zod`**: Generated Zod schemas for API request/response validation.
- **`lib/db`**: Drizzle ORM setup for PostgreSQL database interactions.
- **`scripts`**: Contains utility scripts for various tasks.

**Technology Stack:**
- **Monorepo**: pnpm workspaces
- **Backend**: Node.js 24, Express 5, PostgreSQL, Drizzle ORM, Zod for validation.
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion.
- **API Codegen**: Orval from OpenAPI spec.
- **Build**: esbuild (CJS bundle).

**UI/UX Decisions:**
- **Brand Identity**: Primary color `#1B2A5A` (deep navy), secondary `#5B5EA6` (periwinkle/accent).
- **Design System**: Dark theme with deep navy-black background, glassmorphism cards, gradient text, and glow accents.
- **CSS**: Custom `.glass-card`, `.glass-card-hover`, and Tailwind `@layer utilities` for specific effects like glow-line, glow-dot, text-gradient, and accent-bar.
- **Typography**: Inter (bold) for display, JetBrains Mono for tags.
- **Navigation**: Header with BB icon (`public/logo-icon.png`), simplified navigation (About, Services, Industries, Pricing, Portfolio, Blog), and a "Get Started" CTA.
- **SEO**: Comprehensive SEO meta tags (description, keywords, OG, Twitter cards, JSON-LD), `robots.txt`, `sitemap.xml`, and per-page title management.
- **Forms**: React Hook Form with Zod for validation.

**Key Features and Implementations:**

- **Website Pages**: Home, About, Services, Industries, Pricing, Portfolio, Blog, Contact, Client Portal, Unsubscribe, Welcome, Onboarding, Status, and 404.
- **Self-Service Subscriptions (Stripe)**:
    - API endpoints for `create-checkout-session`, `create-deposit-session`, `webhook` (handling `checkout.session.completed`, `invoice.payment_failed`, `customer.subscription.deleted`), and `onboarding`.
    - One-time deposit payments for Bookkeeping and Business Plan services via Stripe Checkout.
    - Email notifications for subscription and deposit events.
    - Database tables: `subscriptions`, `onboarding_submissions`.
- **Newsletter & Lead Magnet**:
    - Footer newsletter signup.
    - Home page lead magnet ("Financial Readiness Checklist" PDF gated by email).
    - Unsubscribe functionality.
- **Database Schema**: PostgreSQL with Drizzle ORM, including tables for `contact_inquiries`, `newsletter_subscribers`, `contracts`, `contract_templates`, `subscriptions`, `onboarding_submissions`, and `client_documents`.
- **Adobe Acrobat Sign Integration**:
    - Automates contract sending based on form submissions or service bookings.
    - Supports Client Engagement Letter, Mutual NDA, Data Processing Agreement, Scope Change/Add-On.
    - Hourly scheduler for reminders and auto-expiration.
    - Archival of signed PDFs to Adobe Creative Cloud Storage.
    - Admin dashboard for contract management.

## Client Document Upload Portal

- **Purpose**: Securely upload client financial documents.
- **Features**: Drag-and-drop interface, name/email identification, progress indicators.
- **Validation**: Supports specific file types (PDF, DOCX, XLSX, DOC, XLS, JPG, JPEG, PNG, CSV) and a 25MB per-file limit (max 10 files per upload).
- **Storage**: Files uploaded to Adobe Creative Cloud Storage.
- **Notifications**: Email confirmations to clients and notifications to admins.
- **Admin Features**: Listing, downloading, and secure link generation for client uploads.

## Newsletter & Lead Magnet

- **Footer Newsletter Signup**: Email + subscribe button in footer "Stay in the Loop" section.
- **Lead Magnet**: Gated "Financial Readiness Checklist" PDF download on the home page with email capture.
- **Subscriber Management**: Stores subscribers with signup source tracking (footer vs lead_magnet).
- **Unsubscribe**: Dedicated /unsubscribe page marks subscribers as inactive.
- **PDF Resource**: `scripts/generate-checklist-pdf.mjs` generates the lead magnet PDF.

## Monorepo Structure

- **artifacts/api-server**: Express API with routes for contact, newsletter, contracts, payments, and onboarding.
- **artifacts/website**: React frontend using react-router-dom, react-hook-form, and framer-motion.
- **lib/db**: Drizzle ORM setup for PostgreSQL.
- **lib/api-spec**: OpenAPI 3.1 spec and Orval config for API codegen.
- **lib/api-zod**: Generated Zod schemas for API validation.
- **lib/api-client-react**: Generated React Query hooks for API interaction.
- **scripts**: Utility scripts.

## TypeScript Configuration

- **Monorepo Typechecking**: `tsconfig.base.json` with `composite: true` and root `tsconfig.json` with project references ensures correct cross-package type checking and build order.
- **Build Process**: `tsc --build --emitDeclarationOnly` for type declarations; actual JS bundling via esbuild, Vite, or tsx.

# External Dependencies

- **PostgreSQL**: Primary database for all application data, managed with Drizzle ORM.
- **Stripe**: For self-service subscriptions (Essentials & Growth tiers) and one-time deposit payments (Bookkeeping & Business Plans), managing checkout sessions, and webhook processing.
    - Environment secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SITE_URL`, `STRIPE_ESSENTIALS_MONTHLY_PRICE_ID`, `STRIPE_ESSENTIALS_ANNUAL_PRICE_ID`, `STRIPE_GROWTH_MONTHLY_PRICE_ID`, `STRIPE_GROWTH_ANNUAL_PRICE_ID`.
- **Adobe Acrobat Sign API v6**: For e-signature workflows, contract automation, and management.
    - Environment secrets: `ADOBE_SIGN_CLIENT_ID`, `ADOBE_SIGN_CLIENT_SECRET`, `ADOBE_SIGN_REFRESH_TOKEN`.
- **Adobe Creative Cloud Storage**: For archiving signed contracts and storing client-uploaded documents.
- **Resend**: For sending email notifications (e.g., subscription events, deposit payments, document upload confirmations).
- **Calendly**: Potentially integrated for booking webhooks to trigger contract automation.
- **Google Fonts**: Inter and JetBrains Mono for typography.
