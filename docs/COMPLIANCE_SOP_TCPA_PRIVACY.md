# Compliance SOP: TCPA and Privacy Response Workflows

_Last updated: March 31, 2026_

## Purpose

This SOP defines how Blueprints & Bookkeeping handles website inquiry consent records, privacy requests, retention, and disposal to support TCPA/privacy compliance and audit readiness.

## Systems in Scope

- `contact_inquiries` table (all inquiry submissions).
- Website inquiry forms on `/contact`.
- Internal admin workflows that review and close inquiries.

## Data Captured Per Inquiry

For each inquiry, the system records:

- Contact/business submission fields.
- `consent_timestamp` (UTC).
- `consent_text_version` (exact language version ID shown on submit).
- `consent_source_page` (page path where consent was collected).
- `request_ip` and `user_agent` (security/compliance evidence).

## Consent Evidence Workflow (TCPA/Privacy)

1. **At submit time**, application stores consent metadata with inquiry record.
2. **Consent versioning** must be updated whenever disclosure language changes:
   - Update public disclosure text.
   - Bump `consent_text_version` token in frontend code.
   - Deploy both changes together.
3. **Response workflows** (privacy/TCPA complaints, opt-out disputes, legal requests):
   - Pull inquiry by email/phone/date.
   - Export consent metadata (`consent_timestamp`, `consent_text_version`, `consent_source_page`, `request_ip`, `user_agent`).
   - Include record in incident log and response packet.

## Retention and Disposal Policy

### Policy periods

- **0–12 months:** inquiry remains active for servicing and follow-up.
- **After 12 months (Closed inquiries):** auto-archive/redact PII (`name`, `email`, phone/message/business fields, IP, user-agent) and set status to `Archived`.
- **After 24 months (Archived inquiries):** auto-delete permanently.

### Exceptions

- If legal hold, active dispute, or regulator request exists, do not archive/delete until hold is released.

## Operational Responsibilities

- **Operations owner:** ensure inquiries are moved to `Closed` when lifecycle ends.
- **Engineering owner:** maintain scheduler jobs and consent-version updates.
- **Privacy contact:** `tea@blueprintsandbookkeeping.com` receives and coordinates data subject requests.

## Audit and Review Cadence

- Quarterly: verify retention job logs and sample archived/deleted records.
- On any consent text change: verify version bump and policy-page updates before release.
