/**
 * Cloudflare Pages Function: GET /api/openai/conversations/:id
 *                            DELETE /api/openai/conversations/:id
 *
 * Returns or deletes a conversation with its full message history.
 *
 * Storage note: In production, each Pages Function is an independent Worker
 * bundle. Conversation state stored by the /messages handler (in its own
 * isolate) is NOT visible here unless a shared KV namespace binding (CHAT_KV)
 * is configured. If CHAT_KV is not bound, GET requests will return 404 because
 * this isolate has no local copy of conversations created elsewhere.
 * The ChatWidget UI does not call this endpoint, so this is a non-issue for
 * normal site operation.
 */

export interface Env {
  CHAT_KV?: KVNamespace;
}

interface StoredConversation {
  id: number;
  title: string;
  createdAt: string;
  messages: unknown[];
}

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const idParam = (context.params as Record<string, string>).id;
  const id = parseInt(idParam ?? "", 10);

  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid id." }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const kv = context.env.CHAT_KV;
  if (!kv) {
    return new Response(JSON.stringify({ error: "Conversation not found." }), {
      status: 404,
      headers: corsHeaders,
    });
  }

  const raw = await kv.get(`conv:${id}`, "json");
  if (!raw) {
    return new Response(JSON.stringify({ error: "Conversation not found." }), {
      status: 404,
      headers: corsHeaders,
    });
  }

  return new Response(JSON.stringify(raw as StoredConversation), {
    status: 200,
    headers: corsHeaders,
  });
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const idParam = (context.params as Record<string, string>).id;
  const id = parseInt(idParam ?? "", 10);

  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid id." }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const kv = context.env.CHAT_KV;
  if (kv) {
    await kv.delete(`conv:${id}`);
  }

  return new Response(null, { status: 204, headers: corsHeaders });
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
