# Blueprints & Bookkeeping — Website Constraints

> **All task agents and contributors MUST read this file before making changes.**
> These constraints are **non-negotiable**. They reflect business decisions made by the owner (Tea Larson-Hetrick).

---

## 0) How to Use This File (Required)

Before you change anything on the website, verify:

- You are not changing any **Locked Items** (see: “Do NOT Change Without Explicit Instruction”).
- Your changes do not introduce, imply, or amplify **tax services** in any way.
- Services are positioned exactly as defined under “Services & Positioning.”
- Scheduling continues to use **Calendly** (no substitutions).

If you are unsure whether a change violates a constraint: **stop and ask for explicit instruction**.

---

## 1) Services & Positioning (Business Rules)

### 1.1 Core services (the only two to emphasize site-wide)

These are the only services that should be positioned as “core,” “primary,” or “what we do” across the site:

1. **Advanced Bookkeeping**
   - Ongoing monthly bookkeeping
   - QuickBooks Online management
   - Reconciliation
   - Niche industries (e.g., crypto, ag/timber, SaaS, independent contractors, gig-workers, rural businesses)

2. **Business Plans**
   - Startup plans
   - Management reports and financials
   - LivePlan-powered forecasting
   - Target market analysis
   - Growth potential and opportunity analysis
   - Full business plan design

**Constraint:** Do not introduce additional “core” services, and do not visually/verbally give other offerings equal prominence to these two.

### 1.2 Add-on only (never positioned as standalone)

- **The Digital Handshake**
  - Definition: A business plan delivered as a website.
  - Availability: Only available to **existing** bookkeeping or business plan clients.

**Constraints (hard rules):**

- Do **NOT** add The Digital Handshake to:
  - Home page hero
  - Main navigation
  - Any “primary services” area
- Do **NOT** describe it as a core service or standalone offering.

### 1.3 Never offered (do not add, imply, or reference)

The website must never claim or imply that Blueprints & Bookkeeping provides:

- Tax preparation
- Tax filing
- Tax advice
- Tax planning
- Seasonal tax-related services of any kind

**Constraint:** If a page or component introduces tax-service language, remove it. Do not “soften” this by implying “we can help with taxes.”

**Allowed clarification (only if needed):**

- Tax prep and filing can be completed through vetted partner professionals, or clients may use their preferred tax professional.
- The business can provide bookkeeping outputs and financial reports that support a tax professional’s work, but does not provide tax services.

---

## 2) Third-Party Services (What is Actually in Use)

Use only the services below unless there is explicit instruction to add/replace one.

| Service                     | Status | Website / Implementation Notes                                                                                                                                                                                            |
| --------------------------- | -----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Calendly**                |    YES | Primary scheduling method. Primary URL: `https://calendly.com/tea-blueprintsandbookkeeping/30min`                                                                                                                         |
| **QuickBooks Online (QBO)** |    YES | Used for bookkeeping via Intuit Accountant Suite as a ProAdvisor.                                                                                                                                                         |
| **Resend**                  |    YES | All transactional email goes through Resend. API key is stored in environment variables.                                                                                                                                  |
| **Contract Automation**     |    TBD | A contract automation solution is still being selected. Requirements include secure signing, automated contract generation, template support, and API integration. Do not finalize a vendor without explicit instruction. |
| **Stripe**                  |  MAYBE | Payments/invoicing approach is still being evaluated. Do not implement payment flows without explicit instruction.                                                                                                        |
| **LivePlan**                |    YES | Business planning tool partnership.                                                                                                                                                                                       |

---

## 3) Scheduling (Website Rules)

**Always use Calendly.**

- 30-minute introductory / first-time / non-emergency meetings:
  - `https://calendly.com/tea-blueprintsandbookkeeping/30min`
- Emergency / expedited 15-minute meetings (clients and non-clients):
  - `https://calendly.com/tea-blueprintsandbookkeeping/emergency-or-other-expedited-request`

**Constraints:**

- The `/schedule` page embeds Calendly via **iframe**.
- Do **NOT** replace Calendly with another scheduling tool without explicit instruction.
- Do **NOT** change the Calendly URLs.

---

## 4) Credentials & Content Rules (Accuracy Requirements)

### 4.1 Credential labels must be exact

- Use this exact label: **“Intuit Cryptocurrency Tax Certified”**

### 4.2 Education history (degrees)

Tea’s degrees must be listed exactly as:

- MBA
- BSBA
- BS Equine Science
- MSPsy
- PsyD

### 4.3 Certifications (do not rename)

Earned certifications include (keep naming consistent; do not “improve” labels without instruction):

- CEH v12
- QB ProAdvisor Gold
- Intuit Cryptocurrency Tax
- Intuit Tax Exam Level 1
- Intuit QuickBooks Online Level 1
- Intuit QuickBooks Online Advanced Level 2
- Software Engineer Intern
- AI Foundation
- (and any other certifications listed elsewhere in source-of-truth content)

### 4.4 Capacity / scarcity rule

- Maximum client count is **20**.
- This may be mentioned as a subtle scarcity signal where appropriate.
- **Constraint:** Do not repeat it on every page, and do not make it larger/more prominent than other messaging.

### 4.5 Pricing language

- Pricing must use **“starting at”** phrasing.
- **Constraint:** Do not present flat/fixed rates until they are explicitly established.

---

## 5) Key URLs & Contact Info (Source of Truth)

- Email: `tea@blueprintsandbookkeeping.com`
- Phone: `541-319-8654`
- Location: Roseburg, OR (serving nationwide)
- Calendly (30-min): `https://calendly.com/tea-blueprintsandbookkeeping/30min`
- Admin: `/admin` (token-protected)

---

## 6) Do NOT Change Without Explicit Instruction (Locked Items)

These items are locked. Do not modify them unless the owner explicitly instructs you to.

### 6.1 Scheduling & onboarding structure

- The Calendly URLs
- The 4-path **“Get Started”** page structure at `/get-started`
- The `/schedule` Calendly embed approach (iframe)

### 6.2 Security / access patterns

- The admin token authentication pattern
- Admin path: `/admin` (token-protected)

### 6.3 Copy & IA (information architecture)

- The home page hero copy (services positioning)
- The Aria (AI assistant) system prompt paths (must match the Get Started page)
- Navigation order set by Task #7:
  - Services, Industries, About, Pricing, Portfolio, Blog, Resources, Contact

### 6.4 Visual design tokens

- Color scheme:
  - Background: `#0E1118`
  - Card: `#161B2E`
  - Accent: `#6366F1`
- Font stack:
  - Outfit (display)
  - Inter (body)
  - JetBrains Mono (labels)

---
