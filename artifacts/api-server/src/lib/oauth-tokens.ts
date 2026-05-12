import { createSign, createVerify, generateKeyPairSync } from "crypto";

type JwtHeader = {
  alg: "RS256";
  typ: "JWT";
  kid: string;
};

type JwtPayload = {
  iss: string;
  sub: string;
  scope: string;
  iat: number;
  exp: number;
};

const TOKEN_TTL_SECONDS = 60 * 60;
const TOKEN_ISSUER = "blueprints-api";
const KEY_ID = "blueprints-oauth-rs256-v1";

const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

const publicJwk = publicKey.export({ format: "jwk" }) as Record<string, string>;

function base64UrlEncode(input: Buffer | string): string {
  const buffer = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(input: string): Buffer {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return Buffer.from(padded, "base64");
}

export function createAdminAccessToken(clientId: string): {
  accessToken: string;
  expiresIn: number;
} {
  const now = Math.floor(Date.now() / 1000);
  const header: JwtHeader = { alg: "RS256", typ: "JWT", kid: KEY_ID };
  const payload: JwtPayload = {
    iss: TOKEN_ISSUER,
    sub: clientId,
    scope: "admin",
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(privateKey);

  return {
    accessToken: `${unsignedToken}.${base64UrlEncode(signature)}`,
    expiresIn: TOKEN_TTL_SECONDS,
  };
}

export function verifyAdminAccessToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    return false;
  }

  let payload: JwtPayload;
  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload).toString("utf8"));
  } catch {
    return false;
  }

  if (
    payload.iss !== TOKEN_ISSUER ||
    payload.scope !== "admin" ||
    typeof payload.exp !== "number"
  ) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp <= now) {
    return false;
  }

  const verifier = createVerify("RSA-SHA256");
  verifier.update(`${encodedHeader}.${encodedPayload}`);
  verifier.end();
  return verifier.verify(publicKey, base64UrlDecode(encodedSignature));
}

export function getJwks(): { keys: Record<string, string>[] } {
  return {
    keys: [
      {
        ...publicJwk,
        kid: KEY_ID,
        use: "sig",
        alg: "RS256",
      },
    ],
  };
}
