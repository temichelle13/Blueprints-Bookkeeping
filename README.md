<div align="center">

# 🏗️ Blueprints & Bookkeeping

### *Premium Remote Financial Services — Built Different*

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-blueprintsandbookkeeping.com-2563eb?style=for-the-badge)](https://blueprintsandbookkeeping.com)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)

---

**Blueprints & Bookkeeping, LLC** is a premium remote financial services firm based in Roseburg, Oregon, founded by **Tea Larson-Hetrick**. We provide advanced bookkeeping, professional business planning, and strategic advisory services — intentionally capped at **20 active clients** to ensure every business gets the focused, expert attention it deserves.

*This is our full-stack web platform: the front door, the engine room, and everything in between.*

<br>

[✨ Explore the Site](https://blueprintsandbookkeeping.com) · [📋 Services](https://blueprintsandbookkeeping.com/services) · [💬 Meet Aria](https://blueprintsandbookkeeping.com) · [📞 Contact Us](https://blueprintsandbookkeeping.com/contact)

</div>

---

## 🎯 What We Do

> **We don't do taxes. We don't chase volume. We build blueprints for financial clarity.**

Blueprints & Bookkeeping serves complex businesses — from multi-entity operations and agriculture to crypto and timber — with surgical financial precision. Our intentional client cap means you're never a ticket number; you're a strategy partner.

| Service | Description | Starting At |
|:--------|:------------|:------------|
| 📊 **Essentials Bookkeeping** | Monthly reconciliation, QBO management, core financials | $500/mo |
| 📈 **Growth Bookkeeping** | Multi-entity support, niche reconciliation, proactive advisory | $900/mo |
| 🏢 **Advanced Bookkeeping** | Complex structures, consolidated reporting, dedicated strategist | Custom |
| 📝 **Startup Roadmap** | Executive summary, market analysis, 3-year projections | $2,500 |
| 💼 **SBA / Investor Ready Plan** | Full lender package, pitch deck, LivePlan financial modeling | $4,000 |

---

## ⚡ Platform Features

This isn't a brochure site. It's a full-stack business platform designed to deliver a premium client experience from first click to monthly close.

<table>
<tr>
<td width="50%">

### 🤖 Aria — AI Assistant
An intelligent chatbot powered by **GPT-4.1-mini** that knows the business inside-out. Aria answers questions about services, pricing, process, and guides prospects to the right next step — with real-time streaming responses.

### 📬 Smart Contact System
Dual-mode intake forms (quick inquiry + detailed onboarding) with **TCPA-compliant consent tracking**, honeypot spam protection, rate limiting, and automated email routing via **Resend**.

### 💳 Integrated Payments
Seamless **Stripe** checkout for bookkeeping subscriptions (monthly/annual) and one-time business plan deposits. Full webhook lifecycle management for real-time status updates.

</td>
<td width="50%">

### 📄 Contract Management
End-to-end contract workflow with **Adobe Sign** integration — template management, signature routing, status syncing, and signed document retrieval. All from a unified admin dashboard.

### 🔒 Admin Dashboard
Protected internal hub for managing inquiries, newsletter subscribers, email suppression lists, contract pipelines, tax nexus rules, and site analytics.

### 🎨 Premium Design System
Dark-first, glass-morphism aesthetic with **Framer Motion** animations, optimized for Core Web Vitals. Responsive from mobile to ultrawide with accessible, WCAG-aligned components.

</td>
</tr>
</table>

<details>
<summary><b>📋 Even More Features</b></summary>

<br>

- **📰 Blog Engine** — Markdown-powered content system with slug-based routing
- **📅 Calendar Integration** — Cal.com / Calendly scheduling with webhook-driven booking records
- **📧 Newsletter System** — Subscribe/unsubscribe management with email event tracking
- **🔍 SEO Infrastructure** — JSON-LD schema markup (LocalBusiness, ProfessionalService, FAQ, Breadcrumb), dynamic sitemap generation, meta tag management
- **🍪 Cookie Consent** — Compliant consent banner with user preference storage
- **📊 Analytics Hooks** — Page tracking, CTA click events, engagement metrics
- **🖼️ Image Optimization** — WebP with PNG fallback, lazy loading, responsive sizing
- **⚡ Performance** — Code splitting by vendor, lazy route loading, bundle analysis mode
- **🛡️ Security** — Helmet.js headers, rate limiting, constant-time auth comparison, structured logging, centralized env validation

</details>

---

## 🏗️ Architecture

This is a **pnpm monorepo** designed for separation of concerns, type safety across boundaries, and shared code through internal packages.

```
Blueprints-Bookkeeping/
│
├── 📁 artifacts/
│   ├── 🌐 website/               # React 19 + Vite frontend
│   │   ├── src/
│   │   │   ├── pages/            # Route-level page components
│   │   │   ├── components/       # Reusable UI (layout, forms, chat, SEO)
│   │   │   ├── hooks/            # Custom hooks (contact, analytics, theme)
│   │   │   └── lib/              # Utilities and helpers
│   │   └── public/               # Static assets, sitemap, images
│   │
│   └── ⚙️ api-server/            # Express v5 API backend
│       └── src/
│           ├── routes/           # Endpoint handlers (contact, payments, admin…)
│           ├── middleware/        # Auth, rate limiting, logging
│           └── services/         # Business logic (Stripe, Resend, Adobe Sign)
│
├── 📁 lib/
│   ├── db/                       # Drizzle ORM schema & database layer
│   ├── api-zod/                  # Shared Zod validation schemas
│   ├── api-client-react/         # React hooks for API consumption
│   ├── api-spec/                 # API specification definitions
│   ├── integrations-openai-ai-server/   # OpenAI server SDK
│   └── integrations-openai-ai-react/    # OpenAI React components
│
├── 📁 scripts/                   # Build, migration, and utility scripts
├── 📁 docs/                      # Compliance SOPs, specs, recommendations
└── 📄 pnpm-workspace.yaml        # Workspace configuration
```

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="25%"><b>Frontend</b></td>
<td align="center" width="25%"><b>Backend</b></td>
<td align="center" width="25%"><b>Data & Auth</b></td>
<td align="center" width="25%"><b>Integrations</b></td>
</tr>
<tr>
<td>

React 19<br>
TypeScript 6<br>
Vite 8<br>
Tailwind CSS 4<br>
Framer Motion<br>
Radix UI<br>
React Hook Form<br>
TanStack Query<br>
Wouter<br>
Recharts

</td>
<td>

Express v5<br>
TypeScript<br>
Drizzle ORM<br>
Zod Validation<br>
Helmet.js<br>
Rate Limiting<br>
Multer (uploads)<br>
Structured Logging

</td>
<td>

PostgreSQL 16<br>
Drizzle Migrations<br>
Token Auth (Admin)<br>
TCPA Consent DB<br>
Email Suppression<br>
Session Tracking

</td>
<td>

Stripe (Payments)<br>
OpenAI (Chat AI)<br>
Resend (Email)<br>
Adobe Sign (Contracts)<br>
Cal.com (Scheduling)<br>
Svix (Webhooks)<br>
QuickBooks Online

</td>
</tr>
</table>

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|:-----|:--------|
| **Node.js** | `^20.19.0` · `^22.0.0` · `^24.0.0` |
| **pnpm** | `10.13.1` |
| **PostgreSQL** | `16+` |

### Installing pnpm

This project uses [pnpm](https://pnpm.io) as its package manager (version `10.13.1`).

The recommended way to install pnpm and ensure it is on your `PATH` is via **Corepack**, which ships with Node.js 16.9+:

```bash
# Enable Corepack (one-time system setup, may need sudo on Linux/macOS)
corepack enable

# Activate the exact pnpm version declared in package.json
corepack prepare pnpm@10.13.1 --activate
```

After running these commands `pnpm` will be available as a global command.

**Alternative — install via npm:**

```bash
npm install -g pnpm@10.13.1
```

> **Troubleshooting PATH issues:** If `pnpm` is not found after installation, add the pnpm
> global bin directory to your shell's `PATH`. Run `pnpm bin -g` to find the directory, then
> add it to `~/.bashrc`, `~/.zshrc`, or your system's environment variables.
> On Windows you may need to restart your terminal or run `pnpm setup` which automatically
> updates the `PATH` for you.

### Installation

```bash
# Clone the repository
git clone https://github.com/temichelle13/Blueprints-Bookkeeping.git
cd Blueprints-Bookkeeping

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables below)

# Push database schema
pnpm --filter @workspace/db push

# Start development
pnpm run dev
```

### Key Commands

```bash
pnpm run dev                                    # Start API server (Express)
pnpm --filter @workspace/website dev            # Start website dev server (Vite)
pnpm run build                                  # Full production build
pnpm run typecheck                              # TypeScript validation
pnpm run lint                                   # Check formatting (Prettier)
pnpm run format                                 # Auto-format code
pnpm run check:website-deploy                   # Full pre-deployment validation
pnpm --filter @workspace/website build          # Build frontend only
pnpm --filter @workspace/api-server build       # Build backend only
git grep -nE '^(<<<<<<<|=======|>>>>>>>)'       # Scan for merge conflict artifacts
```

---

## 🔐 Environment Variables

Create a `.env` file from `.env.example`. Key variables:

<details>
<summary><b>Click to expand full variable reference</b></summary>

<br>

| Variable | Required | Description |
|:---------|:--------:|:------------|
| `NODE_ENV` | ✅ | `development` or `production` |
| `PORT` | ✅ | API server port (default: `3001`) |
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `CORS_ORIGIN` | ✅ | Allowed origins (comma-separated) |
| `ADMIN_TOKEN` | ✅ | 32+ character admin auth token |
| `VITE_API_URL` | ✅ | API base URL (compile-time) |
| `STRIPE_SECRET_KEY` | ✅ | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Stripe webhook signing secret |
| `RESEND_API_KEY` | ✅ | Resend email service key |
| `OPENAI_API_KEY` | ✅ | OpenAI key required for server startup (used by the Aria chatbot) |
| `OPENAI_CHAT_MODEL` | ⬚ | Model name (default: `gpt-4.1-mini`) |
| `TRUST_PROXY` | ⬚ | Set to `1` behind reverse proxy |

> See `.env.example` for the complete list including Stripe price IDs and Adobe Sign configuration.

</details>

---

## 📦 Deployment

The platform is deployed on **Replit** with a pre-deployment validation pipeline:

```bash
# Full deployment check (recommended before every deploy)
pnpm run check:website-deploy
```

This runs, in order:
1. **TypeScript check** — full type validation across the monorepo
2. **Indexing guards** — ensures no sensitive routes are indexable
3. **Website build** — Vite production build with code splitting

> 📖 See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the complete deployment guide, environment setup, and troubleshooting.

---

## 📚 Documentation

| Document | Description |
|:---------|:------------|
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | Full deployment guide and environment reference |
| [`SECURITY.md`](./SECURITY.md) | Security policy and vulnerability reporting |
| [`SITE_CONSTRAINTS.md`](./SITE_CONSTRAINTS.md) | Business rules, locked content, and messaging guidelines |
| [`docs/COMPLIANCE_SOP_TCPA_PRIVACY.md`](./docs/COMPLIANCE_SOP_TCPA_PRIVACY.md) | TCPA compliance and consent tracking procedures |
| [`artifacts/website/docs/QUALITY_CHECKLIST.md`](./artifacts/website/docs/QUALITY_CHECKLIST.md) | Pre-deployment quality standards |
| [`artifacts/website/docs/IMAGE_OPTIMIZATION.md`](./artifacts/website/docs/IMAGE_OPTIMIZATION.md) | Image optimization guide and best practices |

---

## 🤝 Contributing

This is a private business platform. Contributions are managed internally. If you've been granted access:

1. **Branch** from the latest `main`
2. **Follow** existing code conventions (TypeScript strict, Prettier formatting)
3. **Test** your changes: `pnpm run typecheck`
4. **Build** before pushing: `pnpm run check:website-deploy`
5. **Open a PR** with a clear description of changes

---

## 📄 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for the full license text.

---

<div align="center">

**Built with 💙 in Roseburg, Oregon**

*Blueprints & Bookkeeping, LLC — Financial clarity for complex businesses.*

📧 [tea@blueprintsandbookkeeping.com](mailto:tea@blueprintsandbookkeeping.com) · 📞 (541) 319-8654 · 🌐 [blueprintsandbookkeeping.com](https://blueprintsandbookkeeping.com)

</div>
