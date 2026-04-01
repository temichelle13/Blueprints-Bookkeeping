ALTER TABLE "contact_inquiries"
ADD COLUMN "email_consent" boolean DEFAULT false NOT NULL,
ADD COLUMN "email_consent_captured_at" timestamp with time zone,
ADD COLUMN "email_consent_source" text,
ADD COLUMN "sms_consent_captured_at" timestamp with time zone,
ADD COLUMN "sms_consent_source" text,
ADD COLUMN "phone_consent" boolean DEFAULT false NOT NULL,
ADD COLUMN "phone_consent_captured_at" timestamp with time zone,
ADD COLUMN "phone_consent_source" text,
ADD COLUMN "consent_legal_text_version" text;
