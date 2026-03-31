function resolveOrigin(envValue: string | undefined): string | null {
  if (!envValue) return null;

  try {
    return new URL(envValue).origin;
  } catch {
    return null;
  }
}

export function getMarketingOrigin(): string {
  return (
    resolveOrigin(
      import.meta.env.VITE_MARKETING_ORIGIN as string | undefined,
    ) || window.location.origin
  );
}

export function getPaymentsOrigin(): string {
  return (
    resolveOrigin(import.meta.env.VITE_PAYMENTS_ORIGIN as string | undefined) ||
    getMarketingOrigin()
  );
}

export function buildMarketingUrl(path: string): string {
  return new URL(path, `${getMarketingOrigin()}/`).toString();
}

export function buildPaymentsUrl(path: string): string {
  return new URL(path, `${getPaymentsOrigin()}/`).toString();
}
