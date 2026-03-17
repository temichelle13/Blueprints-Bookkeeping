const ADOBE_SIGN_BASE_URL =
  process.env["ADOBE_SIGN_BASE_URL"] || "https://api.na1.adobesign.com/api/rest/v6";

interface AdobeSignConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  baseUrl: string;
}

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

function getConfig(): AdobeSignConfig | null {
  const clientId = process.env["ADOBE_SIGN_CLIENT_ID"];
  const clientSecret = process.env["ADOBE_SIGN_CLIENT_SECRET"];
  const refreshToken = process.env["ADOBE_SIGN_REFRESH_TOKEN"];

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  return {
    clientId,
    clientSecret,
    refreshToken,
    baseUrl: ADOBE_SIGN_BASE_URL,
  };
}

async function getAccessToken(config: AdobeSignConfig): Promise<string> {
  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken;
  }

  const response = await fetch("https://api.na1.adobesign.com/oauth/v2/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: config.refreshToken,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Adobe Sign token refresh failed: ${response.status} ${text}`);
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  cachedAccessToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
  return cachedAccessToken;
}

async function apiRequest(
  method: string,
  path: string,
  body?: unknown,
): Promise<unknown> {
  const config = getConfig();
  if (!config) {
    throw new Error("Adobe Sign API credentials not configured");
  }

  const token = await getAccessToken(config);
  const url = `${config.baseUrl}${path}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Adobe Sign API error: ${response.status} ${text}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export interface AgreementCreationInfo {
  fileInfos: Array<{ libraryDocumentId?: string; transientDocumentId?: string }>;
  name: string;
  participantSetsInfo: Array<{
    memberInfos: Array<{ email: string }>;
    order: number;
    role: string;
  }>;
  signatureType: string;
  state: string;
  mergeFieldInfo?: Array<{ defaultValue: string; fieldName: string }>;
  emailOption?: {
    sendOptions: {
      completionEmails: string;
      inFlightEmails: string;
      initEmails: string;
    };
  };
  expirationTime?: string;
  reminderFrequency?: string;
}

export interface AgreementResponse {
  id: string;
  status: string;
}

export interface AgreementDetails {
  id: string;
  name: string;
  status: string;
  signedDocumentUrl?: string;
}

export function isConfigured(): boolean {
  return getConfig() !== null;
}

export async function createAgreement(
  info: AgreementCreationInfo,
): Promise<AgreementResponse> {
  const result = await apiRequest("POST", "/agreements", info);
  return result as AgreementResponse;
}

export async function getAgreement(agreementId: string): Promise<AgreementDetails> {
  const result = await apiRequest("GET", `/agreements/${agreementId}`);
  return result as AgreementDetails;
}

export async function getAgreementSigningUrls(
  agreementId: string,
): Promise<{ signingUrlSetInfos: Array<{ signingUrls: Array<{ esignUrl: string }> }> }> {
  const result = await apiRequest("GET", `/agreements/${agreementId}/signingUrls`);
  return result as {
    signingUrlSetInfos: Array<{ signingUrls: Array<{ esignUrl: string }> }>;
  };
}

export async function getSignedDocument(agreementId: string): Promise<ArrayBuffer> {
  const config = getConfig();
  if (!config) throw new Error("Adobe Sign API credentials not configured");

  const token = await getAccessToken(config);
  const response = await fetch(
    `${config.baseUrl}/agreements/${agreementId}/combinedDocument`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to download signed document: ${response.status}`);
  }

  return response.arrayBuffer();
}

export async function sendReminder(
  agreementId: string,
): Promise<void> {
  const members = (await apiRequest("GET", `/agreements/${agreementId}/members`)) as {
    participantSets?: Array<{ participantSetId: string; memberInfos: Array<{ email: string }> }>;
  };

  const participantIds = (members.participantSets || []).map((ps) => ps.participantSetId);

  await apiRequest("POST", `/agreements/${agreementId}/reminders`, {
    recipientParticipantIds: participantIds,
    status: "ACTIVE",
    note: "Friendly reminder: please review and sign your contract at your earliest convenience.",
  });
}

export async function cancelAgreement(agreementId: string): Promise<void> {
  await apiRequest("PUT", `/agreements/${agreementId}/state`, {
    state: "CANCELLED",
  });
}

export async function getLibraryDocuments(): Promise<
  Array<{ id: string; name: string; templateTypes: string[] }>
> {
  const result = (await apiRequest("GET", "/libraryDocuments")) as {
    libraryDocumentList: Array<{ id: string; name: string; templateTypes: string[] }>;
  };
  return result.libraryDocumentList || [];
}

export async function uploadTransientDocument(
  fileName: string,
  fileData: Buffer,
  mimeType: string,
): Promise<string> {
  const config = getConfig();
  if (!config) throw new Error("Adobe Sign API credentials not configured");

  const token = await getAccessToken(config);

  const formData = new FormData();
  formData.append("File-Name", fileName);
  formData.append("File", new Blob([new Uint8Array(fileData)], { type: mimeType }), fileName);

  const response = await fetch(`${config.baseUrl}/transientDocuments`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to upload transient document: ${response.status} ${text}`);
  }

  const data = (await response.json()) as { transientDocumentId: string };
  return data.transientDocumentId;
}
