# Overview

This project is a pnpm monorepo using TypeScript, designed for Blueprints & Bookkeeping, LLC, a remote bookkeeping, business planning, and advisory firm. The primary goal is to provide a professional online presence, automate client interactions, and manage business operations efficiently.

The project features a React-based frontend and an Express API backend, integrating with various services for payments, contract automation, and document management. It aims to offer a self-service experience for clients while streamlining administrative tasks for the firm.

Key capabilities include:
- A public-facing website detailing services, pricing, and company information.
- Self-service subscription management and payment processing via Stripe.
- Automated contract generation and e-signing using Adobe Acrobat Sign.
- A secure client portal for document uploads.
- Lead generation through newsletter signups and gated content.
- Comprehensive SEO features for online visibility.
- A robust backend API built with Express and PostgreSQL.

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
- **UI/UX**: Dark theme with a deep navy-black background (plus light mode toggle), glassmorphism cards, gradient text, and glow accents. Fonts include Inter (display) and JetBrains Mono (tags).
- **SEO**: Comprehensive `index.html` meta tags, `robots.txt`, `sitemap.xml`, and per-page dynamic titles.
- **Pages**: Home, About, Services, Industries, Pricing, Portfolio, Blog, Contact, Client Portal, Unsubscribe, Welcome, Onboarding, and a 404 page.
- **Header**: Displays only the BB icon, with navigation links for About, Services, Industries, Pricing, Portfolio, Blog, and a "Get Started" CTA.

## Backend (`artifacts/api-server`)

- **Framework**: Express 5.
- **Database ORM**: Drizzle ORM with PostgreSQL.
- **Validation**: Zod for API request and response validation, integrated with `drizzle-zod`.
- **API Codegen**: Orval generates API client and Zod schemas from an OpenAPI spec.
- **Build System**: esbuild for CJS bundling.
- **Core Features**:
    - **Stripe Integration**: Handles self-service subscriptions, checkout sessions, and webhook processing for various subscription events (e.g., `checkout.session.completed`, `invoice.payment_failed`). Manages `subscriptions` and `onboarding_submissions` tables.
    - **Adobe Acrobat Sign Integration**: Automates contract generation (Engagement Letter, NDA, DPA, Scope Change), sending, and tracking. Triggers based on form submissions or service bookings. Includes scheduled reminders and archival of signed PDFs to Adobe Creative Cloud Storage. Manages `contracts` and `contract_templates` tables.
    - **Client Document Upload Portal**: Provides a secure mechanism for clients to upload documents (PDF, DOCX, XLSX, JPG, PNG, CSV) directly to Adobe Creative Cloud Storage. Includes file type/size validation and email notifications. Manages `client_documents` table.
    - **Newsletter & Lead Magnet**: Manages newsletter subscriptions and gated content downloads, storing data in `newsletter_subscribers` table.
    - **Contact Forms**: Processes various contact and intake forms, storing data in the `contact_inquiries` table.

## Data Model

- **`contact_inquiries`**: Stores various form submissions.
- **`newsletter_subscribers`**: Manages email subscriptions.
- **`contracts`**: Tracks Adobe Sign contract records.
- **`contract_templates`**: Stores references to Adobe Sign templates.
- **`subscriptions`**: Records Stripe subscription details.
- **`onboarding_submissions`**: Stores self-service client intake form data.
- **`client_documents`**: Records uploaded client documents metadata.

## Monorepo Structure and Tooling

- **Package Manager**: pnpm workspaces.
- **Node.js**: Version 24.
- **TypeScript**: Version 5.9, utilizing composite projects and project references for efficient type-checking across packages. `tsc --build --emitDeclarationOnly` is used for type declaration generation.
- **Shared Libraries**:
    - `lib/api-spec`: Contains OpenAPI 3.1 spec and Orval configuration for API codegen.
    - `lib/api-client-react`: Generated React Query hooks for API interaction.
    - `lib/api-zod`: Generated Zod schemas for request/response validation.
    - `lib/db`: Drizzle ORM setup for PostgreSQL, defining all database schemas.

## Contract Automation

- **Integration**: Adobe Acrobat Sign API v6.
- **Functionality**:
    - Automatic contract generation and sending based on form submissions or service bookings (e.g., Mutual NDA, Engagement Letter).
    - Scheduled reminders for unsigned contracts and auto-expiration.
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
