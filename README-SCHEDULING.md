# Scheduling Integration — Cal.com + Google Calendar

This document walks through the one-time setup required to connect Cal.com scheduling to the Blueprints & Bookkeeping website.

---

## 1. Create a Cal.com Account

1. Go to [https://cal.com/signup](https://cal.com/signup) and create an account.
2. Set the username to `blueprintsandbookkeeping` (this is referenced in the website embed).
3. Complete the profile setup — display name, timezone (America/Los_Angeles for Oregon), and avatar.

---

## 2. Connect Google Workspace Calendar

1. In Cal.com, go to **Settings → Calendars & Conferencing**.
2. Click **Connect Google Calendar**.
3. Sign in with the Google Workspace account (`tea@blueprintsandbookkeeping.com`).
4. Grant calendar read/write permissions when prompted.
5. Under **Checking for conflicts**, ensure the primary Google Calendar is checked. This prevents double-bookings by blocking any time already on the Google Calendar.
6. Under **Add events to**, select the primary Google Calendar. New bookings will automatically appear as calendar events.

---

## 3. Create the Three Event Types

### 3a. Video Call (45 min)

1. Go to **Event Types → New Event Type**.
2. Title: **Video Call**
3. Slug: `video-call`
4. Duration: **45 minutes**
5. Location: **Google Meet** (or Zoom if preferred) — auto-generates a link.
6. Under **Availability**:
   - Set available hours (e.g., Mon–Fri 9:00 AM – 4:00 PM Pacific).
   - Buffer before: **15 minutes**
   - Buffer after: **15 minutes**
   - Minimum notice: **4 hours**
7. Under **Notifications**, enable email confirmations for both host and attendees.
8. Save.

### 3b. Phone Call (30 min)

1. Create another event type.
2. Title: **Phone Call**
3. Slug: `phone-call`
4. Duration: **30 minutes**
5. Location: **Phone (inbound)** — ask the client for their phone number.
6. Same availability and buffer settings as Video Call.
7. Save.

### 3c. Document-Only Async (No Meeting)

1. Create another event type.
2. Title: **Document-Only Review**
3. Slug: `document-review`
4. Duration: **No meeting** (set to a placeholder like 30 min, but clarify in the description that there is no live meeting).
5. Location: **None** — add a note in the description that the client should email or upload documents.
6. In the event description, explain: "This is an asynchronous review. No meeting will take place. Please email your documents to tea@blueprintsandbookkeeping.com after booking."
7. Save.

---

## 4. Configure the Webhook

1. In Cal.com, go to **Settings → Developer → Webhooks**.
2. Click **New Webhook**.
3. **Subscriber URL**: `https://YOUR_DOMAIN/api/webhooks/cal`
   - Replace `YOUR_DOMAIN` with the production domain (e.g., `blueprintsandbookkeeping.com`).
4. **Events to subscribe to**:
   - `BOOKING_CREATED`
   - `BOOKING_RESCHEDULED`
   - `BOOKING_CANCELLED`
5. **Secret**: Generate a strong random secret and copy it.
6. Save.
7. Add the secret as the `CAL_WEBHOOK_SECRET` environment variable in Replit.

---

## 5. Environment Variables

Add the following environment secrets in Replit (Settings → Secrets):

| Variable              | Description                                    |
|-----------------------|------------------------------------------------|
| `CAL_WEBHOOK_SECRET`  | HMAC secret from Cal.com webhook settings      |
| `RESEND_API_KEY`      | Resend API key for sending notification emails  |
| `TWILIO_ACCOUNT_SID`  | Twilio Account SID for SMS notifications        |
| `TWILIO_AUTH_TOKEN`    | Twilio Auth Token                               |
| `TWILIO_FROM_NUMBER`  | Twilio phone number (e.g., `+1234567890`)       |
| `OWNER_PHONE_NUMBER`  | Business owner's phone number for SMS alerts    |
| `OWNER_EMAIL`         | Business owner's email (defaults to `tea@blueprintsandbookkeeping.com`) |

---

## 6. Google Calendar → iPhone Apple Calendar Sync

The Google Workspace calendar will automatically sync bookings to Apple Calendar on iPhone via the existing Google account integration:

### If Google Account is Already on iPhone:

1. Go to **Settings → Calendar → Accounts**.
2. Tap the Google account.
3. Ensure **Calendars** toggle is ON.
4. New Cal.com bookings will appear automatically.

### If Google Account is Not Yet on iPhone:

1. Go to **Settings → Calendar → Accounts → Add Account → Google**.
2. Sign in with `tea@blueprintsandbookkeeping.com`.
3. Enable **Calendars** (and optionally Mail, Contacts).
4. Events will sync within minutes.

### Alternative: iCal Feed (Manual)

1. In Google Calendar (web), go to **Settings → Settings for my calendars → [Calendar Name] → Integrate calendar**.
2. Copy the **Secret address in iCal format** URL.
3. On iPhone: **Settings → Calendar → Accounts → Add Account → Other → Add Subscribed Calendar**.
4. Paste the iCal URL and save.
5. Note: iCal subscriptions are read-only and may have a slight sync delay (up to 15 minutes).

---

## How It Works (Technical Flow)

1. A client visits `/schedule` on the website and sees the Cal.com embed showing live availability.
2. The client selects a meeting type (Video, Phone, or Document-Only) and picks a time slot.
3. Cal.com books the slot, blocks the time on Google Calendar, and sends a confirmation email to both parties.
4. Cal.com fires a webhook to `POST /api/webhooks/cal`.
5. The API server verifies the HMAC signature, upserts the booking into the `bookings` database table, and triggers notifications:
   - **Email** to the owner via Resend with full booking details.
   - **SMS** to the owner via Twilio with a summary.
6. The Google Calendar event appears on the owner's iPhone automatically via Google ↔ iCloud sync.

---

## Troubleshooting

- **Embed not loading**: Ensure the Cal.com username in `Schedule.tsx` matches the actual Cal.com account username.
- **Webhook not firing**: Verify the webhook URL is correct and the server is publicly accessible. Check Cal.com's webhook logs for delivery attempts.
- **Signature verification failing**: Ensure `CAL_WEBHOOK_SECRET` matches exactly what was entered in Cal.com.
- **SMS not sending**: Verify Twilio credentials and that the `TWILIO_FROM_NUMBER` is a valid Twilio phone number.
- **Calendar not syncing to iPhone**: Check that the Google account is properly connected in iPhone Settings and that Calendar sync is enabled.
