import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import newsletterRouter from "./newsletter";
import openaiRouter from "./openai/index";
import feedbackRouter from "./feedback";
import contractsRouter from "./contracts";
import paymentsRouter from "./payments";
import onboardingRouter from "./onboarding";
import documentsRouter from "./documents";
import adminRouter from "./admin";
import calWebhookRouter from "./cal-webhook";
import nexusRouter from "./nexus";
import resendWebhookRouter from "./resend-webhook";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(newsletterRouter);
router.use(openaiRouter);
router.use(feedbackRouter);
router.use(contractsRouter);
router.use(paymentsRouter);
router.use(onboardingRouter);
router.use(documentsRouter);
router.use(adminRouter);
router.use(calWebhookRouter);
router.use(nexusRouter);
router.use(resendWebhookRouter);

export default router;
