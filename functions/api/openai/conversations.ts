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

function generateConversationId(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0];
}

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

  if (typeof data.title !== "string" || data.title.trim().length === 0) {
    return new Response(JSON.stringify({ error: "title is required." }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const title = data.title.slice(0, 200);

  const id = generateConversationId();
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
