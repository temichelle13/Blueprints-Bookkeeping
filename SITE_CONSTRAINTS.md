# Blueprints & Bookkeeping — Site Operating Constraints

> **All task agents and contributors MUST read this file before making changes.**
> These constraints reflect the current business direction from the owner (Tea Larson-Hetrick) and supersede older audit notes or generated requirements files.

---

## 0) How to Use This File

Before changing website copy, UI, API prompts, forms, or integrations, verify that the change:

- Keeps service claims accurate and avoids implying credentials Tea has not claimed.
- Keeps required disclaimers visible only where they materially help a visitor understand limits, consent, privacy, or results-oriented content.
- Preserves the working scheduling path through Calendly unless the owner explicitly approves a replacement.
- Uses current implementation reality rather than stale plans: the database/API platform is still being re-evaluated, and MongoDB plus a low-cost always-on host are preferred future directions.

If a change could create a regulated-service claim, weaken consent capture, or affect production deployment, make the limitation explicit in copy and document the unresolved production issue.

---

## 1) Services & Positioning

### 1.1 Primary public services

The site should emphasize these as the main business lines:

1. **Advanced Bookkeeping**
   - Ongoing monthly bookkeeping
   - QuickBooks Online management
   - Reconciliation and monthly close support
   - Cleanup and niche bookkeeping support for complex small-business activity

2. **Business Plans**
   - Startup plans
   - Management reports and financials
   - LivePlan-powered forecasting
   - Target market analysis
   - Growth potential and opportunity analysis
   - Full business plan design

Tax-related assistance may be mentioned naturally when it is accurate to the service being described. Do not turn tax into the dominant brand promise unless the owner later asks for that positioning.

### 1.2 Add-on only

- **The Digital Handshake**
  - Definition: a business plan delivered as a website.
  - Availability: only for existing bookkeeping or business-plan clients.

Do not present The Digital Handshake as a standalone flagship service without explicit owner approval.

### 1.3 Professional-scope boundaries

Do **not** claim or imply that Blueprints & Bookkeeping LLC is any of the following unless the owner explicitly authorizes exact credential language:

- CPA firm, public accounting firm, accountant, auditor, or attest provider
- Attorney, law firm, or legal representative
- Registered investment adviser, broker, securities professional, or investment manager
- Enrolled Agent or unlimited IRS/state representative

Do **not** claim personal income tax preparation, state tax return preparation, audit/attest services, legal advice, investment advice, or guaranteed compliance outcomes.

Do not make exclusions a major marketing theme. Use a short protective disclaimer in places where a visitor could reasonably mistake website content or tax-related business support for regulated professional services.

---

## 2) Disclaimers, Terms, Policies, and Consent

Required public notices must be accurate, visible, and actually connected to the relevant user journey. Do not keep dead notices that describe tools or flows that are not in use.

### 2.1 Required disclaimer themes

Use concise disclaimers where relevant:

- Blueprints & Bookkeeping LLC is not a CPA firm and does not provide audit or attest services.
- Website content is general information, not legal, investment, or individualized tax advice.
- Tax-related business support, when offered, depends on the specific client agreement and should not be treated as legal, investment, or individualized tax advice.
- Personal income tax and state tax return preparation are not current advertised services, but this should be handled as a concise disclaimer rather than a repeated marketing message.
- Past results, case studies, forecasts, and financing outcomes are examples only and are not guarantees.

### 2.2 Consent and privacy requirements

Public forms must keep:

- Clear email consent when a reply is required.
- Optional SMS and phone consent where those channels are offered.
- Honeypot field `website`.
- Consent text version and source-page metadata.
- Links to Privacy Policy and Terms where users submit personal or business information.

If consent copy changes, bump the relevant consent version token and verify the API still receives it.

### 2.3 Legal/policy pages

The site should maintain working routes for:

- Privacy Policy
- Terms of Service
- Cookie Policy / Cookie Preferences
- Accessibility Statement
- Unsubscribe

Remove or revise policy language that references inactive tools, stale providers, or unused flows.

---

## 3) Third-Party Services and Integrations

| Service                              | Current Direction      | Notes                                                                                                                              |
| ------------------------------------ | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Calendly**                         | YES                    | Primary scheduling method. Keep current URLs unless the owner changes them.                                                        |
| **QuickBooks Online (QBO)**          | YES                    | Likely primary invoicing and bookkeeping platform. Keep alternative payment/invoicing options open when client needs require them. |
| **Resend**                           | LIKELY / CURRENT CODE  | Used by existing email code; verify production configuration before relying on it.                                                 |
| **OpenAI / AI chat**                 | YES, if configured     | Chatbot needs a reliable low-cost API/server plan and graceful offline behavior.                                                   |
| **MongoDB**                          | PREFERRED FUTURE DB    | Owner wants MongoDB; existing code may still use PostgreSQL/Drizzle until migrated.                                                |
| **Stripe**                           | OPTIONAL / NOT PRIMARY | Do not push Stripe as the default payment path. Use only if explicitly enabled.                                                    |
| **Adobe Sign / contract automation** | TBD                    | Do not imply a finalized signing vendor until selected.                                                                            |
| **LivePlan**                         | YES                    | Business planning support.                                                                                                         |

---

## 4) Scheduling

Calendly remains the active scheduling path.

- 30-minute introductory / first-time / non-emergency meetings:
  - `https://calendly.com/tea-blueprintsandbookkeeping/30min`
- Emergency / expedited 15-minute meetings:
  - `https://calendly.com/tea-blueprintsandbookkeeping/emergency-or-other-expedited-request`

The `/schedule` page embeds Calendly via iframe unless explicitly changed.

---

## 5) Credentials & Content Accuracy

### 5.1 Credential labels

Use exact labels from the owner/source content. Do not upgrade informal training, exams, certificates, or platform badges into professional licenses.

Known labels include:

- CEH v12
- QB ProAdvisor Gold
- Intuit Cryptocurrency Tax
- Intuit Tax Exam Level 1
- Intuit QuickBooks Online Level 1
- Intuit QuickBooks Online Advanced Level 2
- Software Engineer Intern
- AI Foundation

### 5.2 Education history

Tea’s degrees must be listed exactly as:

- MBA
- BSBA
- BS Equine Science
- MSPsy
- PsyD

### 5.3 Pricing and availability

- Pricing should use **“starting at”**, **“quoted after review”**, or **“custom quote”** unless flat pricing is explicitly approved.
- Maximum client count is **20** and may be used as a subtle scarcity signal, not repeated everywhere.

---

## 6) UI, Accessibility, and Design Requirements

The site must be readable and usable in light and dark modes. Prioritize:

- Sufficient text/background contrast for body text, muted text, form labels, placeholders, buttons, and cards.
- Visible keyboard focus states.
- Semantic headings and form labels.
- Mobile-friendly spacing and tap targets.
- Avoiding placeholder copy unless explicitly authorized.
- Modern, trustworthy visual design appropriate for bookkeeping and financial services.

Design tokens may evolve to fix accessibility, readability, or brand quality issues. Do not preserve old colors if they make text unreadable.

---

## 7) Deployment and Production Reality

The repo currently contains code and docs for a React/Vite website, Express API server, Cloudflare Pages Functions, and PostgreSQL/Drizzle. The owner has stated the current database/API setup is not working for production needs and wants a low-cost, reliable path with MongoDB preferred.

Until the migration is designed and implemented:

- Do not claim the database/API stack is production-ready.
- Keep chat/contact forms graceful when server integrations are unavailable.
- Document unresolved production issues in final reports.
- Prefer simple, low-cost, always-on infrastructure recommendations.

---

## 8) Stale Requirements

Older audits, attached assets, generated requirement files, or remediation plans are context only. They must not override this file, current user instructions, or implementation reality.
