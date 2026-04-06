# Chatbot Availability Handling Design

## Problem

The live website chatbot UI is deployed, but the production API route used by the widget is not reachable on the same origin. On March 22, 2026, `POST /api/openai/conversations` on `https://blueprintsandbookkeeping.com` returned `405 Method Not Allowed`, which means the widget currently fails before it can start a conversation.

## Goals

- Prevent visitors from seeing a broken or misleading chat experience.
- Detect unavailable chat infrastructure quickly.
- Provide compliant, clear fallback paths to reach Tea directly.
- Preserve the existing streaming chat experience when the backend is healthy.

## Chosen approach

1. Add a lightweight availability check from the chat widget to the API health endpoint.
2. Treat failed health checks and failed conversation/message requests as an unavailable-chat state.
3. In the unavailable state:
   - disable text submission,
   - explain that Aria is temporarily offline,
   - provide direct contact, email, schedule, and retry actions.

## Why this approach

- It addresses the immediate user-facing failure without waiting for production infrastructure changes.
- It reduces frustration by showing a truthful status instead of a spinner followed by a generic error.
- It preserves the current architecture and does not require a backend redesign.

## Non-goals

- Replatforming the API to a new hosting provider.
- Rewriting the chat backend contract.
- Changing prompt behavior or lead-capture logic.

## Production follow-up required

- Ensure the frontend deployment points `VITE_API_URL` at the real backend origin if frontend and API are hosted separately.
- Or deploy rewrites/proxying so `/api/openai/*` on the public site reaches the Express backend.
- Confirm `CORS_ORIGIN` includes `https://blueprintsandbookkeeping.com`.

## Validation plan

- Typecheck the website after the widget changes.
- Build the website bundle.
- Verify the widget shows the unavailable state when the API health probe fails.
