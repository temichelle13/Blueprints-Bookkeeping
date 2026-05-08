import { TURNSTILE_ACTION, TURNSTILE_SITE_KEY } from "@/lib/turnstile";

export function TurnstileWidget() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      {/* Turnstile is rendered inside each protected form so cf-turnstile-response is available in form data. */}
      <div
        className="cf-turnstile"
        data-sitekey={TURNSTILE_SITE_KEY}
        data-action={TURNSTILE_ACTION}
      />
    </div>
  );
}
