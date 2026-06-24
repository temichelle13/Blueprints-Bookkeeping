const CC_STORAGE_BASE_URL = "https://cc-api-storage.adobe.io/v2";

function normalizeAndValidateAssetPath(filePath: string): string {
  if (!filePath || typeof filePath !== "string") {
    throw new Error("Invalid CC Storage path");
  }

  const trimmed = filePath.trim();
  if (!trimmed) {
    throw new Error("Invalid CC Storage path");
  }

  const rawSegments = trimmed.split("/");
  if (rawSegments.some((segment) => segment.length === 0)) {
    throw new Error("Invalid CC Storage path");
  }

  const safeSegments = rawSegments.map((segment) => {
    if (
      segment === "." ||
      segment === ".." ||
      /[\\?#]/.test(segment) ||
      /[\u0000-\u001F\u007F]/.test(segment)
    ) {
      throw new Error("Invalid CC Storage path");
    }
    return encodeURIComponent(segment);
  });

  return safeSegments.join("/");
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env["ADOBE_SIGN_CLIENT_ID"];
  const clientSecret = process.env["ADOBE_SIGN_CLIENT_SECRET"];
  const refreshToken = process.env["ADOBE_SIGN_REFRESH_TOKEN"];

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Adobe API credentials not configured for CC Storage");
  }

  const response = await fetch("https://ims-na1.adobelogin.com/ims/token/v3", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Adobe CC token refresh failed: ${response.status} ${text}`,
    );
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

export async function uploadToCreativeCloud(
  filePath: string,
  fileData: ArrayBuffer | Uint8Array,
  contentType: string = "application/pdf",
): Promise<string> {
  const token = await getAccessToken();
  const apiKey = process.env["ADOBE_SIGN_CLIENT_ID"];
  const safeAssetPath = normalizeAndValidateAssetPath(filePath);
  const uploadUrl = new URL(
    `/v2/assets/${safeAssetPath}`,
    "https://cc-api-storage.adobe.io",
  );

  const response = await fetch(uploadUrl.toString(), {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": apiKey || "",
      "Content-Type": contentType,
    },
    body:
      fileData instanceof ArrayBuffer
        ? fileData
        : (fileData.buffer.slice(
            fileData.byteOffset,
            fileData.byteOffset + fileData.byteLength,
          ) as ArrayBuffer),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`CC Storage upload failed: ${response.status} ${text}`);
  }

  return filePath;
}

export function buildArchivePath(
  clientName: string,
  contractType: string,
): string {
  const year = new Date().getFullYear();
  const safeName = clientName
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "_");
  const typeLabel = contractType.replace(/_/g, "-");
  const date = new Date().toISOString().split("T")[0];
  return `Blueprints_Bookkeeping/Contracts/${year}/${safeName}/${typeLabel}_${date}.pdf`;
}
