/**
 * Cloudflare Pages Function: GET /api/healthz
 *
 * Health check endpoint used by the chat widget to determine if the API
 * is available before showing the chat interface.
 */

export const onRequestGet: PagesFunction = async () => {
  return new Response(
    JSON.stringify({
      status: "ok",
      db: "ok",
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    },
  );
};
