import { validateEnv, getEnv } from "./config/env";
import { logger } from "./lib/logger";
import app from "./app";
import { connectToDatabase } from "@workspace/db";
import {
  checkAndSendReminders,
  syncAllPendingAgreements,
} from "./lib/contract-service";
import {
  recordSchedulerRun,
  recordSchedulerError,
} from "./lib/scheduler-health";
import { runNexusCheck, ensureNexusRulesSeeded } from "./lib/nexus-service";
import { runInquiryRetentionPolicy } from "./lib/inquiry-retention";
import { processPendingOutboundEmailEvents } from "./lib/outbound-email-events";

// Validate environment variables at startup
try {
  validateEnv();
  logger.info("Environment variables validated successfully");
} catch (error) {
  logger.error("Failed to validate environment variables", error as Error);
  process.exit(1);
}

const env = getEnv();
const port = env.PORT;

const REMINDER_INTERVAL_MS = 60 * 60 * 1000;
const INQUIRY_RETENTION_INTERVAL_MS = 24 * 60 * 60 * 1000;

const OUTBOUND_EMAIL_RETRY_INTERVAL_MS = 60 * 1000;

function startOutboundEmailRetryScheduler() {
  async function run() {
    try {
      const processed = await processPendingOutboundEmailEvents();
      recordSchedulerRun("outboundEmailRetry", processed);
      if (processed > 0) {
        logger.info("Processed queued outbound email events", { processed });
      }
    } catch (err) {
      recordSchedulerError("outboundEmailRetry");
      logger.error("Outbound email retry scheduler error", err as Error);
    } finally {
      setTimeout(run, OUTBOUND_EMAIL_RETRY_INTERVAL_MS);
    }
  }

  setTimeout(run, 15_000);
}

function startContractScheduler() {
  async function run() {
    try {
      const syncCount = await syncAllPendingAgreements();
      if (syncCount > 0) {
        logger.info("Contract statuses synced", { count: syncCount });
      }

      const { remindersProcessed, expired } = await checkAndSendReminders();
      recordSchedulerRun("contract", syncCount + remindersProcessed + expired);
      if (remindersProcessed > 0 || expired > 0) {
        logger.info("Contract reminders processed", {
          remindersProcessed,
          expired,
        });
      }
    } catch (err) {
      recordSchedulerError("contract");
      logger.error("Contract scheduler error", err as Error);
    }
  }

  setInterval(run, REMINDER_INTERVAL_MS);
  setTimeout(run, 10_000);
}

function startNexusScheduler() {
  async function run() {
    try {
      const { warnings, alerts } = await runNexusCheck();
      recordSchedulerRun("nexus", warnings + alerts);
      if (warnings > 0 || alerts > 0) {
        logger.info("Nexus check completed", { warnings, alerts });
      }
    } catch (err) {
      recordSchedulerError("nexus");
      logger.error("Nexus scheduler error", err as Error);
    }
  }

  function getMsUntilNext8amPacific(): number {
    const now = new Date();
    const pacificNow = new Date(
      now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
    );
    const target = new Date(pacificNow);
    target.setHours(8, 0, 0, 0);

    if (pacificNow >= target) {
      target.setDate(target.getDate() + 1);
    }

    const msUntil = target.getTime() - pacificNow.getTime();

    // Ensure we never return a negative value
    return Math.max(msUntil, 0);
  }

  function scheduleNext() {
    const msUntil = getMsUntilNext8amPacific();
    logger.info("Next nexus check scheduled", {
      minutesUntil: Math.round(msUntil / 60000),
    });
    setTimeout(async () => {
      await run();
      scheduleNext();
    }, msUntil);
  }

  scheduleNext();
}

function startInquiryRetentionScheduler() {
  async function run() {
    try {
      await runInquiryRetentionPolicy();
      recordSchedulerRun("inquiryRetention");
    } catch (err) {
      recordSchedulerError("inquiryRetention");
      logger.error("Inquiry retention scheduler error", err as Error);
    }
  }

  setInterval(run, INQUIRY_RETENTION_INTERVAL_MS);
  setTimeout(run, 15_000);
}

app.listen(port, async () => {
  logger.info("Server started", { port, environment: env.NODE_ENV });

  try {
    await connectToDatabase();
    logger.info("Connected to MongoDB");
  } catch (err) {
    logger.error("Failed to connect to MongoDB", err as Error);
    process.exit(1);
  }

  try {
    await ensureNexusRulesSeeded();
    logger.info("Nexus rules seeded successfully");
  } catch (err) {
    logger.error("Failed to seed nexus rules", err as Error);
  }

  startContractScheduler();
  startNexusScheduler();
  startInquiryRetentionScheduler();
});
