import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes";

const app: Express = express();

app.use(helmet());

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
