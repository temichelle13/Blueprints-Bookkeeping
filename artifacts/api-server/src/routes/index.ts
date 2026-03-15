import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import newsletterRouter from "./newsletter";
import openaiRouter from "./openai/index";
import feedbackRouter from "./feedback";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(newsletterRouter);
router.use(openaiRouter);
router.use(feedbackRouter);

export default router;
