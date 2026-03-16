import express, { type Express, type Request } from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes";

interface RawBodyRequest extends Request {
  rawBody?: Buffer;
}

const app: Express = express();

app.use(helmet());

app.use((req, res, next) => {
  res.setHeader("Sec-GPC", "1");
  req.gpc = req.headers["sec-gpc"] === "1";
  next();
});

const isProduction = process.env.NODE_ENV === "production";
const corsOriginEnv = process.env.CORS_ORIGIN;

const allowedOrigins: string[] | undefined = corsOriginEnv
  ? corsOriginEnv.split(",").map((o) => o.trim())
  : undefined;

app.use(
  cors({
    origin: isProduction
      ? allowedOrigins ?? false
      : allowedOrigins ?? true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  }),
);

app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
);

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
