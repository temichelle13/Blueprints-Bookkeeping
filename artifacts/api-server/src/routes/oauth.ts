import { Router, type IRouter } from "express";
import { getEnv } from "../config/env";

const CLIENT_ID = "blueprints-agent";
const TOKEN_TTL_SECONDS = 60 * 60;

const router: IRouter = Router();

function parseBasicAuth(header: string | undefined): {
  clientId?: string;
  clientSecret?: string;
} {
  if (!header || !header.startsWith("Basic ")) {
    return {};
  }

  try {
    const encoded = header.slice("Basic ".length).trim();
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex <= 0) {
      return {};
    }

    return {
      clientId: decoded.slice(0, separatorIndex),
      clientSecret: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return {};
  }
}

router.get("/oauth/authorize", (_req, res): void => {
  res.status(400).json({
    error: "unsupported_response_type",
    error_description:
      "This authorization server supports the client_credentials grant type only.",
  });
});

router.post("/oauth/token", (req, res): void => {
  const grantType =
    typeof req.body?.grant_type === "string" ? req.body.grant_type : undefined;
  if (grantType !== "client_credentials") {
    res.status(400).json({
      error: "unsupported_grant_type",
      error_description: "Only client_credentials is supported.",
    });
    return;
  }

  const authHeader =
    typeof req.headers.authorization === "string"
      ? req.headers.authorization
      : undefined;
  const basic = parseBasicAuth(authHeader);

  const clientId =
    basic.clientId ??
    (typeof req.body?.client_id === "string" ? req.body.client_id : undefined);
  const clientSecret =
    basic.clientSecret ??
    (typeof req.body?.client_secret === "string"
      ? req.body.client_secret
      : undefined);

  const env = getEnv();
  if (clientId !== CLIENT_ID || clientSecret !== env.ADMIN_TOKEN) {
    res
      .status(401)
      .setHeader("WWW-Authenticate", "Basic realm=\"oauth-token\"")
      .json({
        error: "invalid_client",
        error_description: "Client authentication failed.",
      });
    return;
  }

  res.json({
    access_token: env.ADMIN_TOKEN,
    token_type: "Bearer",
    expires_in: TOKEN_TTL_SECONDS,
    scope: "admin",
  });
});

export default router;
