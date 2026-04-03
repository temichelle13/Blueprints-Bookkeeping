/**
 * Cloudflare Pages Function: POST /api/openai/conversations
 *                            GET  /api/openai/conversations  (list)
 *
 * Creates chat conversations for the Aria AI assistant widget.
 * The ID returned here is passed to /[id]/messages for all subsequent
 * message sends.
 *
 * Note: Conversation history and message data are stored by the messages
 * handler. This endpoint only issues an ID; if CHAT_KV is not bound the
 * GET list will always be empty (each function is an independent isolate).
 */

export interface Env {
  CHAT_KV?: KVNamespace;
}

// Module-level counter — ephemeral, resets on Worker restart.
// Good enough for issuing unique IDs within a session.
let nextId = 1;

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const onRequestGet: PagesFunction<Env> = async () => {
  // Listing conversations requires KV. Return empty array without it.
  return new Response(JSON.stringify([]), {
    status: 200,
    headers: corsHeaders,
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const data =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};
  const title = typeof data.title === "string" ? data.title.slice(0, 200) : "Chat";

  const id = nextId++;
  const createdAt = new Date().toISOString();

  return new Response(
    JSON.stringify({ id, title, createdAt }),
    { status: 201, headers: corsHeaders },
  );
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
