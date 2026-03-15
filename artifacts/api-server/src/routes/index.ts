import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import newsletterRouter from "./newsletter";
import openaiRouter from "./openai/index";
import feedbackRouter from "./feedback";
import contractsRouter from "./contracts";
import paymentsRouter from "./payments";
import onboardingRouter from "./onboarding";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(newsletterRouter);
router.use(openaiRouter);
router.use(feedbackRouter);
router.use(contractsRouter);
router.use(paymentsRouter);
router.use(onboardingRouter);

export default router;
