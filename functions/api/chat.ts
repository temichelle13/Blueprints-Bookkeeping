/**
 * Cloudflare Pages Function: /api/chat
 *
 * This route is kept for backwards compatibility but the active chat endpoints
 * are under /api/openai/conversations/* (see functions/api/openai/).
 */

export const onRequest: PagesFunction = async () => {
  return new Response(
    JSON.stringify({
      error:
        "Use /api/openai/conversations instead. This endpoint is deprecated.",
    }),
    {
      status: 410,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
