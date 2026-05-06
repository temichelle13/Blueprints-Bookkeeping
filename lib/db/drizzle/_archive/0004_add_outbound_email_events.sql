CREATE TABLE IF NOT EXISTS outbound_email_events (
  id serial PRIMARY KEY,
  inquiry_id integer NOT NULL REFERENCES contact_inquiries(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  recipient_email text NOT NULL,
  provider_message_id text,
  status text NOT NULL DEFAULT 'queued',
  attempt_count integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 3,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  error_payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS outbound_email_events_inquiry_id_idx
  ON outbound_email_events(inquiry_id);

CREATE INDEX IF NOT EXISTS outbound_email_events_status_next_attempt_idx
  ON outbound_email_events(status, next_attempt_at);

CREATE INDEX IF NOT EXISTS outbound_email_events_type_status_idx
  ON outbound_email_events(event_type, status);
