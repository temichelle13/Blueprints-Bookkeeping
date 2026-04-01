ALTER TABLE outbound_email_events
  ADD COLUMN IF NOT EXISTS email_payload jsonb;
