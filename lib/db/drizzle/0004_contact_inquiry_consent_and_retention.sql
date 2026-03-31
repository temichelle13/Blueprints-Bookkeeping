ALTER TABLE contact_inquiries
  ADD COLUMN consent_timestamp timestamp with time zone NOT NULL DEFAULT now(),
  ADD COLUMN consent_text_version text NOT NULL DEFAULT 'legacy-unknown',
  ADD COLUMN request_ip text NOT NULL DEFAULT 'unknown',
  ADD COLUMN user_agent text NOT NULL DEFAULT 'unknown',
  ADD COLUMN consent_source_page text NOT NULL DEFAULT '/contact';

COMMENT ON COLUMN contact_inquiries.consent_timestamp IS 'UTC timestamp when inquiry consent was captured';
COMMENT ON COLUMN contact_inquiries.consent_text_version IS 'Version token for the exact consent language shown at submit time';
COMMENT ON COLUMN contact_inquiries.request_ip IS 'Submitting client IP for abuse prevention and compliance audit records';
COMMENT ON COLUMN contact_inquiries.user_agent IS 'Submitting browser user-agent for abuse prevention and compliance audit records';
COMMENT ON COLUMN contact_inquiries.consent_source_page IS 'Website path where consent was captured (for example /contact)';
