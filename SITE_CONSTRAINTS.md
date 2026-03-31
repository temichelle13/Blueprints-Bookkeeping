# Blueprints & Bookkeeping — Site Constraints

> **All task agents and contributors MUST read this file before making changes.**
> These rules are non-negotiable. They reflect business decisions made by the owner (Tea Larson-Hetrick).

---

## Services — What This Business Does

### CORE services (the only two to emphasize everywhere):

1. **Advanced Bookkeeping** — ongoing monthly bookkeeping, QuickBooks Online management, reconciliation, niche industries (crypto, ag/timber, SaaS, independent contractors, gig-workers, rural businesses, niche industries), emergency bookkeeping or same-day reports or cleanup (within reasonable bounds), one time services, training and troubleshooting, payroll, bill pay, A/R and A/P, Assets (fixed, current, depreciation)
2. **Business Plans** — startup plans, management reports, financials, LivePlan-powered forecasting, target market analysis, growth pothential, new market opportunities, full business plan design, PDF delivery of documents, website of business plan summary with shareable link, roadmaps, pricing strategy

### ADD-ON only (never positioned as a standalone or core service):

- **The Digital Handshake** — a business plan delivered as a website. Only available to existing bookkeeping or business plan clients. **Do NOT add it to the home page hero, main nav, or anywhere it would appear as a third core service.**

### NEVER offered (do not add, imply, or reference):

- Tax preparation
- Tax filing
- Tax advice
- Tax planning
- Any seasonal tax-related services
**All tax prep and filing will be able to be done seamlessly through partners that have been vetted and trusted by BPBK or clients can use their preffered tax  pro. Financial reports and reports for accountants are available when needed for subsscriptions, one time services for reports will be a charged services if not a current client.**
---

## Third-Party Services Actually in Use

| Service             | In Use | Notes                                                                                                                                                                                                                                                                                                                                 |
| ------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Calendly**        | YES    | URL: `https://calendly.com/tea-blueprintsandbookkeeping/30min`                                                                                                                                                                                                                                                                         |
| **QuickBooks Online** | YES  | Tea uses QBO for bookkeeping via Intuit Accountant Suite as a ProAdvisor. Client subscriptions can be billed directly to the client, through the firm (client pays the firm), or via revenue‑share programs. If a client already has a subscription, they can simply add Tea as their accountant. If they want to change tiers or add‑ons, Tea will advise to ensure best pricing. |
| **Resend**          | YES    | All transactional email goes through Resend (API key stored in environment variables).                                                                                                                                                                                                                                                 |
| **Contract Automation (TBD)** | TBD | A contract automation solution is still being selected. Requirements: secure signing, automated contract generation, template support, API integration, automated sending, storage, and update workflows. Must be seamless, feature‑rich, and cost‑effective.                                                                                         |
| **Stripe**          | MAYBE  | Still determining the best setup for payments and invoicing to maximize transparency, record retention, and ease of billing. Currently evaluating whether QBO, Stripe, or a hybrid approach is best long‑term.                                                                                                                          |
| **LivePlan**        | YES    | Business planning tool partnership.                                                                                                                                                                                                                                                                                                    |


---

## Scheduling

- **Always use Calendly**
- Calendly URL FOR 30-mINUTE INTRODUCTORY MEETINGS AND first time meeting for non emergency bookings `https://calendly.com/tea-blueprintsandbookkeeping/30min`
- The /schedule page embeds Calendly via iframe
- Do NOT replace this with any other scheduling service without explicit instruction
-  Emergency 15 minute meetings for urgent matters for clients or non/new clients: https://calendly.com/tea-blueprintsandbookkeeping/emergency-or-other-expedited-request


---

## Credentials & Content Rules

- "Intuit Cryptocurrency Tax Certified" is the correct credential label 
- Degrees from Tea's education history: MBA, BSBA, BS Equine Science, MSPsy, PsyD
- Earned certifications (CEH v12, QB ProAdvisor Gold, Intuit Cryptocurrency Tax, Intuit Tax Exam Level 1, Intuit Quickbooks Online Level 1 and Advanced Level 2, Software Engineer Intern, AI Foundations from Google, Harvard Certification in Leadership and Communications, Yale Psychology Certification) may be listed fully
- Max client count is **20** — mention as a scarcity signal where appropriate, but do not repeat on all pages and do not make it bigger than other content. this is very secondary
- Pricing always uses "starting at" phrasing — never flat/fixed rates until they are established

---

## Key URLs & Contact Info

- Email: tea@blueprintsandbookkeeping.com
- Phone: 541-319-8654
- Location: Roseburg, OR (serving nationwide)
- Calendly: https://calendly.com/tea-blueprintsandbookkeeping/30min
- Admin: /admin (token-protected)

---

## Do NOT Change Without Explicit Instruction

- The Calendly URL
- The 4-path "Get Started" page structure at /get-started
- The admin token authentication pattern
- The hero copy on the home page (services positioning)
- The Aria (AI assistant) system prompt paths — they match the Get Started page
- Navigation order set by Task #7 (Services, Industries, About, Pricing, Portfolio, Blog, Resources, Contact)
- Color scheme: Background #0E1118, Card #161B2E, Accent #6366F1
- Font stack: Outfit (display), Inter (body), JetBrains Mono (labels)

---
