interface OnboardingRouteContext {
  plan?: string | null | undefined;
  service?: string | null | undefined;
  sessionId?: string | null | undefined;
}

export function getOnboardingContextFromSearch(
  search: string,
): OnboardingRouteContext {
  const params = new URLSearchParams(search);

  return {
    plan: params.get("plan"),
    service: params.get("service"),
    sessionId: params.get("session_id"),
  };
}

export function buildOnboardingUrl(
  context: OnboardingRouteContext = {},
): string {
  const params = new URLSearchParams();

  if (context.sessionId) {
    params.set("session_id", context.sessionId);
  }

  if (context.plan) {
    params.set("plan", context.plan);
  }

  if (context.service) {
    params.set("service", context.service);
  }

  const query = params.toString();
  return query ? `/onboarding?${query}` : "/onboarding";
}
