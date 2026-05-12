/**
 * Cloudflare Pages Function middleware — Markdown for Agents
 *
 * Implements HTTP content negotiation so that AI agents requesting
 * `Accept: text/markdown` receive a Markdown version of each public
 * marketing page rather than the React SPA shell.  Browsers that send
 * the normal `Accept: text/html, ...` header (or `Accept: */*`) are
 * unaffected and receive the usual static assets.
 *
 * Per-page Markdown is pre-authored here to ensure accuracy and to avoid
 * the overhead of rendering the client-side React bundle on the server.
 *
 * Spec: https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/
 */

const BASE_URL = "https://blueprintsandbookkeeping.com";
const CALENDLY_URL =
  "https://calendly.com/tea-blueprintsandbookkeeping/30min";
const EMERGENCY_CALENDLY_URL =
  "https://calendly.com/tea-blueprintsandbookkeeping/emergency-or-other-expedited-request";

// ---------------------------------------------------------------------------
// Middleware entry point
// ---------------------------------------------------------------------------

type PagesMiddlewareContext = {
  request: Request;
  next: () => Promise<Response>;
};

export async function onRequest(
  context: PagesMiddlewareContext,
): Promise<Response> {
  const { request } = context;
  const url = new URL(request.url);

  // Pass through API calls, static assets, and files with extensions
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/.well-known/") ||
    /\.\w+$/.test(url.pathname)
  ) {
    return context.next();
  }

  // Content negotiation — only handle explicit markdown preference
  if (!prefersMarkdown(request.headers.get("Accept") ?? "")) {
    return context.next();
  }

  const markdown = getPageMarkdown(url.pathname);
  if (markdown === null) {
    return context.next();
  }

  const tokens = estimateTokens(markdown);

  return new Response(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "x-markdown-tokens": String(tokens),
      "Cache-Control": "public, max-age=3600",
    },
  });
}

// ---------------------------------------------------------------------------
// Content negotiation helpers
// ---------------------------------------------------------------------------

/**
 * Returns true when the Accept header explicitly prefers text/markdown
 * (or text/*) over text/html, following Cloudflare's negotiation rules:
 *
 *   Accept: text/markdown                     → markdown
 *   Accept: text/markdown, text/html;q=0.9   → markdown
 *   Accept: text/*                            → markdown
 *   Accept: */*                              → HTML (browser default)
 */
function prefersMarkdown(accept: string): boolean {
  if (!accept) return false;

  const entries = accept.split(",").map((entry) => {
    const parts = entry.trim().split(";");
    const type = parts[0].trim().toLowerCase();
    const qParam = parts.find((p) => p.trim().toLowerCase().startsWith("q="));
    const q = qParam ? parseFloat(qParam.split("=")[1]) : 1.0;
    return { type, q: isNaN(q) ? 1.0 : q };
  });

  // Find the highest-q text/markdown or text/* entry
  const markdownEntry = entries
    .filter((e) => e.type === "text/markdown" || e.type === "text/*")
    .sort((a, b) => b.q - a.q)[0];

  if (!markdownEntry || markdownEntry.q <= 0) return false;

  // If text/html is explicitly listed with a higher quality, prefer HTML
  const htmlEntry = entries.find((e) => e.type === "text/html");
  if (htmlEntry && htmlEntry.q > markdownEntry.q) return false;

  return true;
}

/** Rough token estimate: 1 token ≈ 4 characters (OpenAI / most LLMs). */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// ---------------------------------------------------------------------------
// Page router
// ---------------------------------------------------------------------------

function getPageMarkdown(pathname: string): string | null {
  const path = pathname === "/" ? "/" : pathname.replace(/\/$/, "");

  const pages: Record<string, () => string> = {
    "/": homeMarkdown,
    "/services": servicesMarkdown,
    "/services/bookkeeping": bookkeepingPageMarkdown,
    "/services/business-plans": businessPlansPageMarkdown,
    "/about": aboutMarkdown,
    "/about/credentials": credentialsMarkdown,
    "/pricing": pricingMarkdown,
    "/contact": contactMarkdown,
    "/faq": faqMarkdown,
    "/industries": industriesMarkdown,
    "/schedule": scheduleMarkdown,
    "/get-started": getStartedMarkdown,
    "/blog": blogMarkdown,
    "/oregon-bookkeeper": oregonBookkeeperMarkdown,
    "/results": resultsMarkdown,
  };

  const fn = pages[path];
  return fn ? fn() : siteOverviewMarkdown(path);
}

// ---------------------------------------------------------------------------
// Per-page Markdown content
// ---------------------------------------------------------------------------

function homeMarkdown(): string {
  return `---
title: Blueprints & Bookkeeping — Your Blueprint to Business Success
url: ${BASE_URL}/
description: Premium remote bookkeeping and business planning for ambitious founders. Based in Roseburg, Oregon; serving clients nationwide.
---

# Blueprints & Bookkeeping

**Your Blueprint to Business Success.**

Blueprints & Bookkeeping, LLC is a boutique remote financial services firm founded by **Tea Larson-Hetrick** in Roseburg, Oregon. The firm serves complex businesses nationwide and is intentionally capped at **20 active clients** to ensure focused, expert attention.

## Core Services

### Advanced Bookkeeping
Ongoing monthly bookkeeping, QuickBooks Online management, reconciliation, financial statements, cleanup, multi-entity consolidation, and niche industry support (crypto, agriculture, timber, SaaS, gig economy, rural businesses).

- Monthly transaction categorization and reconciliation
- Monthly close and financial statement preparation (P&L, balance sheet, cash flow)
- Historical data cleanup and correction
- Multi-entity structuring and intercompany transaction management
- Rule-based QBO automation
- A/R, A/P, payroll, and assets/depreciation
- Information filings (1099s, W-2, etc.)

### Business Plans
Professionally written business plans for startups, SBA applications, investor presentations, and internal roadmaps. Powered by LivePlan for rigorous financial modeling.

- 3-to-5-year financial forecasting
- Target market and competitive analysis
- Full strategic narrative, executive summary, and appendix
- Risk and mitigation analysis
- Business plan summary website design (available to existing clients)

## Why Blueprints & Bookkeeping?

- **12-month availability** — no tax preparation means no seasonal blind spots
- **No offshore — ever** — 100% domestic; your financial data is handled personally
- **Exclusive, high-touch service** — maximum 20 clients; executive-level dedication
- **Advanced technical depth** — certified in cybersecurity (CEH v12), QuickBooks (ProAdvisor Gold), and crypto accounting

## Contact

- **Website:** ${BASE_URL}
- **Email:** tea@blueprintsandbookkeeping.com
- **Phone:** (541) 319-8654
- **Schedule a free 30-minute discovery call:** ${CALENDLY_URL}
`;
}

function servicesMarkdown(): string {
  return `---
title: Services — Blueprints & Bookkeeping
url: ${BASE_URL}/services
description: Advanced bookkeeping and professional business plans for complex businesses.
---

# Services

Beyond simple data entry — robust, modern financial infrastructure tailored for ambitious founders.

## Advanced Bookkeeping & Cleanup

**Type:** Ongoing engagement

For complex operations that have outgrown basic data entry.

### What's Included
- Historical data remediation and cleanup
- Multi-entity structuring and consolidation
- Rule-based QBO automation setup
- Rigorous monthly close procedures
- Specialized niche reconciliation (crypto, agriculture, timber)
- Monthly P&L, balance sheet, and cash flow statements
- A/R, A/P, payroll, assets, and depreciation management
- 1099s, W-2, and other information filings
- Management meetings and business review on a scheduled basis
- Training and QuickBooks troubleshooting

**Pricing:** Starting at $500/month. Final rate based on transaction volume, entities, and complexity. [See full pricing](${BASE_URL}/pricing)

## Business Plans

**Type:** Project engagement

A complete roadmap for where your business is going — built to professional standards.

### What's Included
- Rigorous 3-to-5-year financial forecasting (LivePlan-powered)
- Professional plan formatting
- Deep market analysis and competitive positioning
- Target market analysis and opportunity analysis
- Burn rate analysis for startups
- Strategic narrative development
- Full PDF business plans ready for binding
- Custom documentation and research reports

**Pricing:** Starting at $2,500. [See full pricing](${BASE_URL}/pricing)

## Important Note

Blueprints & Bookkeeping does **not** provide tax preparation, tax filing, tax advice, or tax planning. Clean books and financial reports are provided for your CPA or chosen tax professional.

## Ready to Get Started?

- [Schedule a free 30-minute discovery call](${CALENDLY_URL})
- [Contact us](${BASE_URL}/contact)
- [View pricing](${BASE_URL}/pricing)
`;
}

function bookkeepingPageMarkdown(): string {
  return `---
title: Advanced Bookkeeping — Blueprints & Bookkeeping
url: ${BASE_URL}/services/bookkeeping
description: Ongoing advanced bookkeeping via QuickBooks Online for complex businesses.
---

# Advanced Bookkeeping

Ongoing, expert-level bookkeeping delivered through QuickBooks Online. Built for businesses with complexity — multiple entities, niche industries, high transaction volume, or messy historical records.

## What's Included

- Monthly transaction categorization, reconciliation, and close
- Financial statement preparation (P&L, balance sheet, cash flow)
- Historical cleanup and catch-up bookkeeping
- Multi-entity structuring and intercompany transactions
- Rule-based QBO automation to reduce manual error
- Niche reconciliation: crypto, agriculture, timber, e-commerce
- A/R, A/P, payroll support, assets, depreciation schedules
- 1099s, W-2, and other information filings
- Scheduled management meetings and business review
- Training and QBO troubleshooting

## Pricing (Starting At)

| Tier       | Monthly | Annual    |
|------------|---------|-----------|
| Essentials | $500    | $5,400    |
| Growth     | $900    | $9,720    |
| Advanced   | Custom  | Custom    |

A mandatory **Technology & Security Surcharge of $50/month** applies to all tiers.

Final pricing is determined after a discovery call based on transaction volume, entity count, and complexity.

## Schedule a Discovery Call

[Book a free 30-minute call](${CALENDLY_URL}) — no commitment required.

Contact: tea@blueprintsandbookkeeping.com | (541) 319-8654
`;
}

function businessPlansPageMarkdown(): string {
  return `---
title: Business Plans — Blueprints & Bookkeeping
url: ${BASE_URL}/services/business-plans
description: Professional business plans with rigorous financial modeling for startups, SBA applications, and investors.
---

# Business Plans

Professionally written, data-driven business plans for any scenario — SBA loan applications, investor presentations, internal roadmaps, or new market entry.

## What's Included

- 3-to-5-year financial forecasting (LivePlan-powered)
- Professional plan formatting and binding-ready PDF
- Deep market research and competitive analysis
- Target market analysis and opportunity sizing
- Strategic narrative, executive summary, and appendix
- Burn rate and sensitivity analysis for startups
- Risk and mitigation analysis
- Growth potential and opportunity analysis
- 1–2 revision rounds (depending on package)

## Packages

### Startup Roadmap — Starting at $2,500
Ideal for early-stage businesses seeking internal clarity or initial bank conversations.
- 3-year financial forecast
- Market overview and opportunity summary
- Basic competitor landscape
- Executive summary and narrative
- Standard formatting
- 1 revision round

### Full Plan Package — Starting at $4,000
Comprehensive, in-depth plan with detailed financial modeling and full strategic narrative.
- 5-year rigorous financial model
- Professional plan formatting
- Deep market research and analysis
- Full competitor positioning
- Burn rate and sensitivity analysis
- Executive summary, narrative, and appendix
- 2 revision rounds

## Ready to Start?

[Schedule a free discovery call](${CALENDLY_URL}) to discuss your goals and determine which package fits your needs.

Contact: tea@blueprintsandbookkeeping.com | (541) 319-8654
`;
}

function aboutMarkdown(): string {
  return `---
title: About Tea Larson-Hetrick — Blueprints & Bookkeeping
url: ${BASE_URL}/about
description: Advanced bookkeeping and business plan consulting from a QuickBooks ProAdvisor, cybersecurity-certified founder in Roseburg, Oregon.
---

# Meet Tea Larson-Hetrick

**Founder & Principal Consultant**  
Blueprints & Bookkeeping, LLC · Roseburg, Oregon

Tea brings a rare intersection of enterprise financial management, software engineering, and cybersecurity to bookkeeping and business planning.

## Background

Tea has deep experience in financial operations for complex, multi-entity businesses and understands exactly where standard accounting breaks down. Generalist bookkeepers hit a "complexity ceiling" — leaving founders with messy historical data, mismatched records, and a lack of strategic foresight.

Blueprints & Bookkeeping was founded to fill that gap with advanced technical depth, year-round availability, and a boutique model deliberately capped at 20 active clients.

## Credentials

- **QB ProAdvisor Gold** — QuickBooks Online advanced certification
- **CEH v12** — Certified Ethical Hacker (cybersecurity)
- **Intuit Cryptocurrency Tax Certified** — crypto accounting specialist
- **Intuit Tax Exam Level 1**
- **Intuit QuickBooks Online Level 1 & Advanced Level 2**
- **AI Foundation**
- **Software Engineer Intern**

## Education

- PsyD
- MSPsy
- MBA
- BSBA
- BS Equine Science

## Philosophy

> "Standard accounting firms are excellent for annual compliance, but founders with growing complexity need a different kind of partner — someone who understands the business, not just the numbers."

Tea's approach combines financial precision, cybersecurity-grade data handling, and strategic advisory — all delivered with personal attention to a small, carefully selected client roster.

## Work with Tea

- [Schedule a free discovery call](${CALENDLY_URL})
- [Contact us](${BASE_URL}/contact)
- [View credentials](${BASE_URL}/about/credentials)
`;
}

function credentialsMarkdown(): string {
  return `---
title: Credentials — Tea Larson-Hetrick | Blueprints & Bookkeeping
url: ${BASE_URL}/about/credentials
description: Full credential and certification inventory for Tea Larson-Hetrick, founder of Blueprints & Bookkeeping.
---

# Credentials — Tea Larson-Hetrick

Founder & Principal Consultant, Blueprints & Bookkeeping, LLC

## Certifications

| Credential                                   | Issuer   |
|----------------------------------------------|----------|
| QB ProAdvisor Gold                           | Intuit   |
| Intuit Cryptocurrency Tax Certified          | Intuit   |
| Intuit Tax Exam Level 1                      | Intuit   |
| Intuit QuickBooks Online Level 1             | Intuit   |
| Intuit QuickBooks Online Advanced Level 2    | Intuit   |
| CEH v12 (Certified Ethical Hacker)           | EC-Council |
| AI Foundation                                | —        |
| Software Engineer Intern                     | —        |

## Education

| Degree          | Field                  |
|-----------------|------------------------|
| PsyD            | Psychology             |
| MSPsy           | Psychology             |
| MBA             | Business Administration |
| BSBA            | Business Administration |
| BS              | Equine Science         |

## Verify & Learn More

Full badge verification links and issuer details are available on the credentials page: ${BASE_URL}/about/credentials
`;
}

function pricingMarkdown(): string {
  return `---
title: Pricing — Blueprints & Bookkeeping
url: ${BASE_URL}/pricing
description: Bookkeeping and business plan pricing starting at $500/month and $2,500 per project.
---

# Pricing

All bookkeeping pricing is "starting at" — final rates are determined after a free discovery call based on transaction volume, entity count, and complexity.

## Bookkeeping Plans

A mandatory **Technology & Security Surcharge of $50/month** applies to all bookkeeping tiers.

### Essentials — Starting at $500/month

For single-entity businesses with straightforward transactions.

| Feature                          | Included |
|----------------------------------|----------|
| Single entity                    | ✓        |
| Up to 200 transactions/month     | ✓        |
| Monthly reconciliation & close   | ✓        |
| QuickBooks Online management     | ✓        |
| Monthly P&L and balance sheet    | ✓        |
| Email support                    | ✓        |

- Monthly: $500/month (+ $50 surcharge)
- Annual: $5,400/year (+ $600 surcharge) — saves $600

---

### Growth — Starting at $900/month *(Most Popular)*

For growing businesses with higher volume, multiple accounts, or niche complexity.

| Feature                                    | Included |
|--------------------------------------------|----------|
| Up to 2 entities                           | ✓        |
| Up to 600 transactions/month               | ✓        |
| Rule-based QBO automation                  | ✓        |
| Niche reconciliation (crypto, ag, timber)  | ✓        |
| Monthly financials + cash flow report      | ✓        |
| Proactive advisory communication           | ✓        |
| Priority response                          | ✓        |

- Monthly: $900/month (+ $50 surcharge)
- Annual: $9,720/year (+ $600 surcharge) — saves $1,080

---

### Advanced — Custom Pricing

For multi-entity structures, high-volume operations, and complex consolidations.

- 3+ entities or complex structures
- Unlimited transaction volume
- Intercompany and consolidated reporting
- Historical cleanup included
- Full suite of financial statements
- Dedicated point of contact
- Monthly strategy check-in

[Contact for pricing](${BASE_URL}/contact)

---

## Business Plans

### Startup Roadmap — Starting at $2,500

Ideal for early-stage businesses or initial bank conversations.

- 3-year financial forecast
- Market overview and opportunity summary
- Basic competitor landscape
- Executive summary and narrative
- Standard formatting
- 1 revision round

---

### Full Plan Package — Starting at $4,000

Comprehensive, in-depth plan with detailed financial modeling.

- 5-year rigorous financial model
- Professional plan formatting
- Deep market research and analysis
- Full competitor positioning
- Burn rate and sensitivity analysis
- Executive summary, narrative, and appendix
- 2 revision rounds

---

## Get a Quote

[Schedule a free 30-minute discovery call](${CALENDLY_URL}) — no commitment required. Final pricing is confirmed after we review your situation.

Contact: tea@blueprintsandbookkeeping.com | (541) 319-8654
`;
}

function contactMarkdown(): string {
  return `---
title: Contact — Blueprints & Bookkeeping
url: ${BASE_URL}/contact
description: Get in touch with Blueprints & Bookkeeping to start your bookkeeping or business plan project.
---

# Contact Blueprints & Bookkeeping

## Direct Contact

| Method  | Details                                     |
|---------|---------------------------------------------|
| Email   | tea@blueprintsandbookkeeping.com            |
| Phone   | (541) 319-8654                              |
| Website | ${BASE_URL}                        |

## Schedule a Meeting

- **Free 30-minute discovery call:** [Book on Calendly](${CALENDLY_URL})
- **Emergency or expedited (15 min):** [Book on Calendly](${EMERGENCY_CALENDLY_URL})

## Contact Form

A contact form is available at ${BASE_URL}/contact for quick inquiries and detailed bookkeeping intake. You will receive a response within one business day.

## What Happens After You Reach Out

1. Response within one business day
2. Discovery call scheduled (30 minutes, free)
3. Custom proposal sent within 48 hours of the call
4. Onboarding typically takes 1–2 weeks

## Location

Based in **Roseburg, Oregon** — serving clients nationwide. All services are delivered remotely.
`;
}

function faqMarkdown(): string {
  return `---
title: FAQ — Blueprints & Bookkeeping
url: ${BASE_URL}/faq
description: Frequently asked questions about bookkeeping, business plans, pricing, and process at Blueprints & Bookkeeping.
---

# Frequently Asked Questions

## Bookkeeping

**What's included in your bookkeeping service?**  
Every bookkeeping engagement includes monthly transaction categorization and reconciliation, monthly close procedures, financial statement preparation (P&L, balance sheet, cash flow), and proactive communication on anything unusual. Rule-based automation in QuickBooks Online is set up to reduce manual entry and errors.

**Do you do taxes or tax preparation?**  
No — and that's intentional. We focus exclusively on bookkeeping and financial planning year-round, which means we're always available and never disappear during tax season. Your CPA handles taxes; we make sure your books are clean and accurate so that handoff is seamless.

**Can you clean up old or messy books?**  
Yes — historical cleanup is one of our specialties. Whether your books haven't been touched in months or you've inherited a disorganized chart of accounts, we'll work backward to reconcile and correct the records. Cleanup projects are scoped and quoted separately before we begin.

**Do you work with multiple business entities?**  
Absolutely. We handle multi-entity structures, intercompany transactions, and consolidated reporting. This is common for clients with an operating company, holding company, or real estate entities alongside a main business.

**What industries do you specialize in?**  
We have deep experience in agriculture, timber, small manufacturing, real estate, e-commerce, and businesses with crypto asset activity. If your business has niche reconciliation needs — livestock sales, commodity revenue, crypto purchases — we know how to handle it correctly.

---

## Business Plans

**What's the difference between your Business Plan tiers?**  
The Startup Roadmap is ideal for early-stage businesses — it includes a 3-year forecast, market overview, and executive summary. The Full Plan Package is a comprehensive, in-depth document with 5-year rigorous modeling, deep competitor analysis, and a complete strategic narrative.

**How long does a business plan take?**  
Most plans are delivered within 2 to 4 weeks from the time we receive your input documents and complete the onboarding call. Turnaround depends on how quickly we can gather your financial history, industry data, and goals — the more prepared you are, the faster we move.

**Who is the business plan written for?**  
That depends on your goals. We discuss the purpose of the plan during our discovery call — whether it's for a bank conversation, a partner presentation, an internal roadmap, or something else entirely — and tailor the content and format accordingly.

**Can the plan be used for different purposes?**  
Yes. A well-written business plan can serve multiple purposes — presenting to a bank, sharing with a potential partner, guiding internal decisions, or supporting a loan application. We make sure the document is clear, thorough, and professional regardless of who reads it.

---

## Pricing & Process

**How is bookkeeping pricing determined?**  
Bookkeeping is priced based on three main factors: monthly transaction volume, the number of entities or accounts we're managing, and niche complexity (crypto, agriculture, multi-currency, etc.). We provide a flat monthly rate after a brief discovery call — no surprises, no hourly billing.

**Do you offer a free consultation?**  
Yes. We offer a free 30-minute discovery call to understand your situation, answer your questions, and determine if we're a good fit. You can book directly on our scheduling page or reach out via the contact form.

**What happens after I reach out?**  
After you submit the contact form or book a call, you'll hear from us within one business day. We'll schedule a discovery call, review your current situation, and send a custom proposal within 48 hours of that call. Onboarding typically takes 1 to 2 weeks.

**Do you work with clients outside Oregon?**  
Yes — we serve clients nationwide. All services are delivered remotely. Many of our clients are in other states; location is never a barrier to working together.

---

## More Questions?

- [Schedule a free discovery call](${CALENDLY_URL})
- Email: tea@blueprintsandbookkeeping.com
- Phone: (541) 319-8654
`;
}

function industriesMarkdown(): string {
  return `---
title: Industries We Serve — Blueprints & Bookkeeping
url: ${BASE_URL}/industries
description: Specialized bookkeeping for agriculture, timber, crypto, e-commerce, multi-entity portfolios, and tech startups.
---

# Industry Expertise

We solve the high-friction financial challenges specific to complex, asset-heavy, and emerging markets.

## Agriculture & Timber

**Focus:** Douglas County and rural Oregon operations

- Schedule F complexities and farm income reporting
- Advanced equipment depreciation schedules
- Multi-crew seasonal payroll structures
- Livestock, commodity, and timber revenue reconciliation

## Crypto & Digital Assets

**Focus:** Emerging markets and blockchain-native businesses

- ASU 2023-08 compliance for digital asset accounting
- Blockchain reconciliation across wallets and exchanges
- DeFi transaction integration into traditional general ledgers
- Cost basis tracking across multiple chains

## Gig Economy & E-commerce

**Focus:** High-volume, multi-platform operations

- Multi-platform reconciliation: Stripe, PayPal, Shopify, Amazon
- Accurate margin analysis across channels
- Contractor and 1099 tracking
- Inventory and COGS management

## Multi-Entity Portfolios

**Focus:** Real estate and holding company structures

- Separate ledgers for each entity
- Intercompany transaction resolution
- Consolidated reporting for complex asset-heavy operators
- Holding company and operating company structuring

## Tech Founders & Startups

**Focus:** High-growth, fast-moving businesses

- Deep burn rate analysis
- Operational cost tracking
- Forecasting models for fundraising and runway planning
- SaaS metrics and ARR/MRR reporting

## Don't See Your Niche?

Our technical foundation adapts to complex environments quickly. If your business has unusual financial complexity, we can likely help. [Contact us](${BASE_URL}/contact) to discuss your situation.
`;
}

function scheduleMarkdown(): string {
  return `---
title: Schedule — Blueprints & Bookkeeping
url: ${BASE_URL}/schedule
description: Book a free discovery call with Tea Larson-Hetrick at Blueprints & Bookkeeping.
---

# Schedule a Meeting

## Free 30-Minute Discovery Call

The best way to start is a free 30-minute discovery call. We'll discuss your current situation, answer your questions, and determine if we're a good fit.

[Book on Calendly →](${CALENDLY_URL})

## Emergency or Expedited (15 Minutes)

For urgent situations or existing clients with time-sensitive needs:

[Book expedited call →](${EMERGENCY_CALENDLY_URL})

## What to Expect

1. **Book your time** — choose a slot that works for you on Calendly
2. **We review your request** — Tea reviews before accepting
3. **Discovery call (30 min)** — discuss your business, goals, and challenges
4. **Custom proposal** — delivered within 48 hours of the call
5. **Onboarding** — typically 1–2 weeks to get started

## Other Ways to Reach Us

- **Contact form:** [${BASE_URL}/contact](${BASE_URL}/contact)
- **Email:** tea@blueprintsandbookkeeping.com
- **Phone:** (541) 319-8654
`;
}

function getStartedMarkdown(): string {
  return `---
title: Get Started — Blueprints & Bookkeeping
url: ${BASE_URL}/get-started
description: Choose your path to working with Blueprints & Bookkeeping.
---

# Get Started

Choose the path that fits your situation:

## I Need a Bookkeeper

Ready to get your books under control? Schedule a free discovery call:

[Book a 30-minute call →](${CALENDLY_URL})

Or [fill out the contact form](${BASE_URL}/contact) with details about your business and current bookkeeping situation.

## I Need a Business Plan

Working on a startup, SBA application, or investor presentation?

[Book a 30-minute call →](${CALENDLY_URL})

Or [contact us](${BASE_URL}/contact) with your project scope and timeline.

## I'm Not Sure Yet

That's fine — a 30-minute call is free and there's no commitment. We'll help you figure out what you need.

[Book a call →](${CALENDLY_URL})

## I'm an Existing Client Giving Accountant Access

Existing QuickBooks clients: contact Tea directly before granting accountant access so she can review your setup before accepting.

- Email: tea@blueprintsandbookkeeping.com
- Phone: (541) 319-8654

---

**Location:** Roseburg, Oregon — serving clients nationwide  
**Availability:** Year-round (no seasonal tax-season disappearing act)  
**Client cap:** Maximum 20 active clients
`;
}

function blogMarkdown(): string {
  return `---
title: Blog — Blueprints & Bookkeeping
url: ${BASE_URL}/blog
description: Financial insights, bookkeeping tips, and business planning guidance from Blueprints & Bookkeeping.
---

# Blog

Financial insights, bookkeeping tips, and business planning guidance from Tea Larson-Hetrick.

Visit [${BASE_URL}/blog](${BASE_URL}/blog) to read the latest articles on:

- Advanced bookkeeping practices and QuickBooks tips
- Business planning and financial forecasting
- Niche industries: crypto, agriculture, multi-entity structures
- Small business financial management

---

Contact: tea@blueprintsandbookkeeping.com | (541) 319-8654  
[Schedule a free discovery call](${CALENDLY_URL})
`;
}

function oregonBookkeeperMarkdown(): string {
  return `---
title: Oregon Bookkeeper — Blueprints & Bookkeeping
url: ${BASE_URL}/oregon-bookkeeper
description: Advanced bookkeeping services based in Roseburg, Oregon. Serving Oregon businesses and clients nationwide.
---

# Oregon Bookkeeper — Blueprints & Bookkeeping

**Based in Roseburg, Oregon. Serving clients statewide and nationwide.**

Blueprints & Bookkeeping provides advanced bookkeeping for Oregon-based businesses — from Douglas County agriculture and timber operations to Portland-area tech startups and multi-entity real estate portfolios.

## Oregon-Specific Expertise

- **Agriculture & Timber:** Schedule F, equipment depreciation, seasonal payroll — particularly for Douglas County and southern Oregon operations
- **Rural Businesses:** Niche reconciliation for commodity-based and resource-extraction industries
- **Multi-Entity Oregon LLCs and Corporations:** Intercompany transaction management and consolidated reporting

## Serving Clients Nationwide

While based in Roseburg, Oregon, all services are delivered remotely. Oregon business owners receive the same access to national best practices and advanced QBO capabilities as clients in other states.

## Get Started

- [Schedule a free 30-minute discovery call](${CALENDLY_URL})
- [Contact us](${BASE_URL}/contact)
- Email: tea@blueprintsandbookkeeping.com | Phone: (541) 319-8654
`;
}

function resultsMarkdown(): string {
  return `---
title: Results — Blueprints & Bookkeeping
url: ${BASE_URL}/results
description: Client outcomes and results from Blueprints & Bookkeeping engagements.
---

# Client Results

Blueprints & Bookkeeping works with a deliberately small client roster — maximum 20 active clients — to ensure exceptional outcomes for every engagement.

## What Clients Experience

- Clean, accurate books that hold up to audit and lender scrutiny
- Financial clarity that enables confident business decisions
- Historical cleanups that surface hidden errors and correct them permanently
- Multi-entity consolidation that makes complex portfolios legible
- Business plans that open doors to SBA loans, investor conversations, and strategic partnerships

## How We Work

Every engagement begins with a discovery call, followed by a thorough review of your current financial situation. We scope the work clearly, price it fairly, and deliver with consistency.

## Start Your Engagement

- [Schedule a free discovery call](${CALENDLY_URL})
- [View services](${BASE_URL}/services)
- [View pricing](${BASE_URL}/pricing)
- Email: tea@blueprintsandbookkeeping.com | Phone: (541) 319-8654
`;
}

function siteOverviewMarkdown(path: string): string {
  return `---
title: Blueprints & Bookkeeping
url: ${BASE_URL}${path}
description: Advanced bookkeeping and professional business plans for complex businesses. Based in Roseburg, Oregon; serving clients nationwide.
---

# Blueprints & Bookkeeping

Advanced bookkeeping and professional business plans for complex businesses. Founded by Tea Larson-Hetrick in Roseburg, Oregon; serving clients nationwide.

## Core Services

- **Advanced Bookkeeping** — Ongoing monthly bookkeeping, QBO management, reconciliation, multi-entity support, niche industries (crypto, agriculture, timber, e-commerce)
- **Business Plans** — Professional plans with rigorous financial modeling for startups, SBA applications, and investors

## Key Pages

- [Home](${BASE_URL}/)
- [Services](${BASE_URL}/services)
- [Industries](${BASE_URL}/industries)
- [About](${BASE_URL}/about)
- [Pricing](${BASE_URL}/pricing)
- [FAQ](${BASE_URL}/faq)
- [Contact](${BASE_URL}/contact)
- [Schedule a Call](${BASE_URL}/schedule)

## Contact

- Email: tea@blueprintsandbookkeeping.com
- Phone: (541) 319-8654
- [Book a free 30-minute discovery call](${CALENDLY_URL})
`;
}
