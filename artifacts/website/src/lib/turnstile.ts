export const TURNSTILE_SITE_KEY = "0x4AAAAAADLpQMbvvBKwhryc";
export const TURNSTILE_ACTION = "lead_form";
export const TURNSTILE_RESPONSE_FIELD = "cf-turnstile-response";
export const MAX_TURNSTILE_TOKEN_LENGTH = 2048;

export function getTurnstilePayload(
  form: HTMLFormElement,
): Record<typeof TURNSTILE_RESPONSE_FIELD, string> | null {
  const token = new FormData(form).get(TURNSTILE_RESPONSE_FIELD);
  if (typeof token !== "string") return null;
  const trimmedToken = token.trim();
  if (!trimmedToken || trimmedToken.length > MAX_TURNSTILE_TOKEN_LENGTH) {
    return null;
  }
  return { [TURNSTILE_RESPONSE_FIELD]: trimmedToken };
}
