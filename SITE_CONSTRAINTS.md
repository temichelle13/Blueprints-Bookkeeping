# Blueprints & Bookkeeping — Site Constraints

> **All task agents and contributors MUST read this file before making changes.**
> These rules are non-negotiable. They reflect business decisions made by the owner (Tea Larson-Hetrick).

---

## Services — What This Business Does

### CORE services (the only two to emphasize everywhere):
1. **Advanced Bookkeeping** — ongoing monthly bookkeeping, QuickBooks Online management, reconciliation, niche industries (crypto, ag/timber, SaaS)
2. **Business Plans** — startup plans, SBA-ready plans, investor-ready financials, LivePlan-powered forecasting

### ADD-ON only (never positioned as a standalone or core service):
- **The Digital Handshake** — a business plan delivered as a website. Only available to existing bookkeeping or business plan clients. **Do NOT add it to the home page hero, main nav, or anywhere it would appear as a third core service.**

### NEVER offered (do not add, imply, or reference):
- Tax preparation
- Tax filing
- Tax advice
- Tax planning
- Any seasonal tax-related services

---

## Third-Party Services Actually in Use

| Service | In Use | Notes |
|---------|--------|-------|
| **Calendly** | YES | URL: `https://calendly.com/tea-blueprintsandbookkeeping/30min` |
| Cal.com | NO | Do NOT integrate. Do NOT embed. Do NOT reference. |
| QuickBooks Online | YES | Tea uses QBO. Stripe for online sign-ups. QB Payments for invoicing existing clients. |
| Resend | YES | All transactional email goes through Resend (API key in env) |
| Adobe Acrobat Sign | YES | Contract automation |
| Stripe | YES | Online sign-up checkout for Essentials/Growth only. NOT for invoicing existing clients. |
| Plausible | YES | Analytics. Configured via VITE_ANALYTICS_ID env var. |
| LivePlan | YES | Business planning tool partnership |

---

## Scheduling

- **Always use Calendly**, not Cal.com
- Calendly URL: `https://calendly.com/tea-blueprintsandbookkeeping/30min`
- The /schedule page embeds Calendly via iframe
- Do NOT replace this with any other scheduling service without explicit instruction

---

## Credentials & Content Rules

- "Advanced Crypto Accounting Certified" is the correct credential label (not "Crypto Tax Certified")
- Degrees from Tea's education must be referred to as "coursework" or "studies" — never "degree" or "completed"
- Earned certifications (CEH v12, QB ProAdvisor Gold, Advanced Crypto Accounting Certified, OR Notary RON) may be listed fully
- Max client count is **20** — mention as a scarcity signal where appropriate
- Pricing always uses "starting at" phrasing — never flat/fixed rates

---

## Key URLs & Contact Info

- Email: tea@blueprintsandbookkeeping.com
- Phone: 541-319-8654
- Location: Roseburg, OR (serving nationwide)
- Calendly: https://calendly.com/tea-blueprintsandbookkeeping/30min
- Client portal: /client-portal
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

## Common Mistakes Task Agents Make

1. **Swapping Calendly for Cal.com** — Cal.com is NOT used here
2. **Listing Digital Handshake as a core service** — it is add-on only
3. **Mentioning tax services** — Tea does NOT do taxes, ever
4. **Changing "starting at" pricing to flat rates** — always use "starting at"
5. **Breaking App.tsx route registration** when adding new pages — always add both the import AND the Route
6. **Forgetting to update sitemap.xml** when adding new public pages
