import { normalizeApiBaseUrl } from "@workspace/api-client-react";

const API_PREFIX = "/api";

// VITE_API_URL may be a bare origin (https://api.example.com) or an already-prefixed
// API base (https://api.example.com/api). Leave it unset for same-origin deployments.
export function getApiRoot(): string {
  const configuredBase = normalizeApiBaseUrl(
    import.meta.env.VITE_API_URL as string | undefined,
  );
  return configuredBase ? `${configuredBase}${API_PREFIX}` : API_PREFIX;
}
