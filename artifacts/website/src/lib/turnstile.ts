export const TURNSTILE_SITE_KEY = "0x4AAAAAADLpQMbvvBKwhryc";
export const TURNSTILE_ACTION = "lead_form";
export const TURNSTILE_RESPONSE_FIELD = "cf-turnstile-response";

export function getTurnstilePayload(
  form: HTMLFormElement,
): Record<typeof TURNSTILE_RESPONSE_FIELD, string> | null {
  const token = new FormData(form).get(TURNSTILE_RESPONSE_FIELD);
  if (typeof token !== "string") return null;
  const trimmedToken = token.trim();
  if (!trimmedToken || trimmedToken.length > 2048) return null;
  return { [TURNSTILE_RESPONSE_FIELD]: trimmedToken };
}
