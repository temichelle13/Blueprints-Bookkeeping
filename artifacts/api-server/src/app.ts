import express, { type Express, type Request } from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes";

interface RawBodyRequest extends Request {
  rawBody?: Buffer;
}

function parseAllowedCorsOrigins(
  corsOriginEnv: string | undefined,
): string[] | undefined {
  if (!corsOriginEnv) {
    return undefined;
  }

  const configuredOrigins = corsOriginEnv
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const invalidOrigins: string[] = [];
  const allowedOrigins = configuredOrigins.flatMap((origin) => {
    try {
      const parsedOrigin = new URL(origin);
      const isHttpProtocol =
        parsedOrigin.protocol === "http:" || parsedOrigin.protocol === "https:";
      const hasOriginOnlyPath = parsedOrigin.pathname === "/";
      const hasNoSearch = parsedOrigin.search === "";
      const hasNoHash = parsedOrigin.hash === "";

      if (!isHttpProtocol || !hasOriginOnlyPath || !hasNoSearch || !hasNoHash) {
        invalidOrigins.push(origin);
        return [];
      }

      return [parsedOrigin.origin];
    } catch {
      invalidOrigins.push(origin);
      return [];
    }
  });

  if (invalidOrigins.length > 0) {
    throw new Error(
      `Invalid CORS_ORIGIN value${invalidOrigins.length === 1 ? "" : "s"}: ${invalidOrigins.join(", ")}. ` +
        "Expected a comma-separated list of full origin URLs like https://blueprintsandbookkeeping.com",
    );
  }

  return [...new Set(allowedOrigins)];
}

function parseTrustProxy(value: string | undefined): number | boolean {
  if (!value) {
    return false;
  }

  const normalizedValue = value.trim().toLowerCase();
  if (["true", "yes", "on"].includes(normalizedValue)) {
    return true;
  }

  if (["false", "no", "off", "0"].includes(normalizedValue)) {
    return false;
  }

  const parsedNumber = Number.parseInt(normalizedValue, 10);
  if (Number.isInteger(parsedNumber) && parsedNumber >= 1) {
    return parsedNumber;
  }

  throw new Error(
    `Invalid TRUST_PROXY value: ${value}. Use a positive integer hop count (recommended: 1), or true/false.`,
  );
}

const app: Express = express();

app.set("trust proxy", parseTrustProxy(process.env.TRUST_PROXY));

app.use(helmet());

app.use((req, res, next) => {
  res.setHeader("Sec-GPC", "1");
  req.gpc = req.headers["sec-gpc"] === "1";
  next();
});

const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = parseAllowedCorsOrigins(process.env.CORS_ORIGIN);

if (isProduction && (!allowedOrigins || allowedOrigins.length === 0)) {
  throw new Error(
    "CORS_ORIGIN must be set in production to a comma-separated list of allowed website origin URLs, for example https://blueprintsandbookkeeping.com",
  );
}

app.use(
  cors({
    origin: isProduction ? allowedOrigins : (allowedOrigins ?? true),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  }),
);

app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(
  "/api/webhooks/cal",
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(
  "/api/webhooks/resend",
  express.json({
    verify: (req: RawBodyRequest, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
