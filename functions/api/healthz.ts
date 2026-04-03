/**
 * Cloudflare Pages Function: GET /api/healthz
 *
 * Health check endpoint used by the chat widget to determine if the API
 * is available before showing the chat interface.
 *
 * Returns the same shape as the Express server health route so existing
 * API clients remain compatible. The `db` field reflects whether the
 * optional CHAT_KV binding (used for durable chat history) is reachable.
 * When no KV binding is configured, the Pages Functions are still healthy
 * and `db` is reported as "ok".
 */

export interface Env {
  CHAT_KV?: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  let dbStatus: "ok" | "error" = "ok";

  // If a KV namespace is bound, verify it is reachable.
  if (context.env.CHAT_KV) {
    try {
      await context.env.CHAT_KV.get("__healthcheck__");
    } catch {
      dbStatus = "error";
    }
  }

  const overallStatus = dbStatus === "ok" ? "ok" : "degraded";

  return new Response(
    JSON.stringify({
      status: overallStatus,
      db: dbStatus,
      timestamp: new Date().toISOString(),
    }),
    {
      status: overallStatus === "ok" ? 200 : 503,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    },
  );
};
