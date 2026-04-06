CREATE TYPE "public"."suppression_reason" AS ENUM('unsubscribed', 'bounced', 'spam_complaint', 'manual');--> statement-breakpoint
CREATE TABLE "email_suppression_list" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"reason" "suppression_reason" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "email_suppression_list_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "contact_inquiries" ADD COLUMN "sms_consent" boolean DEFAULT false NOT NULL;