import app from "./app";
import { checkAndSendReminders, syncAllPendingAgreements } from "./lib/contract-service";
import { runNexusCheck, ensureNexusRulesSeeded } from "./lib/nexus-service";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const REMINDER_INTERVAL_MS = 60 * 60 * 1000;

function startContractScheduler() {
  async function run() {
    try {
      const syncCount = await syncAllPendingAgreements();
      if (syncCount > 0) console.log(`Synced ${syncCount} contract statuses`);

      const { remindersProcessed, expired } = await checkAndSendReminders();
      if (remindersProcessed > 0 || expired > 0) {
        console.log(`Contract reminders: ${remindersProcessed} sent, ${expired} expired`);
      }
    } catch (err) {
      console.error("Contract scheduler error:", err);
    }
  }

  setInterval(run, REMINDER_INTERVAL_MS);
  setTimeout(run, 10_000);
}

function startNexusScheduler() {
  async function run() {
    try {
      const { warnings, alerts } = await runNexusCheck();
      if (warnings > 0 || alerts > 0) {
        console.log(`Nexus check: ${warnings} warnings, ${alerts} alerts sent`);
      }
    } catch (err) {
      console.error("Nexus scheduler error:", err);
    }
  }

  function getMsUntilNext8amPacific(): number {
    const now = new Date();
    const pacificNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
    const target = new Date(pacificNow);
    target.setHours(8, 0, 0, 0);

    if (pacificNow >= target) {
      target.setDate(target.getDate() + 1);
    }

    return target.getTime() - pacificNow.getTime();
  }

  function scheduleNext() {
    const msUntil = getMsUntilNext8amPacific();
    console.log(`Next nexus check scheduled in ${Math.round(msUntil / 60000)} minutes`);
    setTimeout(async () => {
      await run();
      scheduleNext();
    }, msUntil);
  }

  scheduleNext();
}

app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  try {
    await ensureNexusRulesSeeded();
  } catch (err) {
    console.error("Failed to seed nexus rules:", err);
  }
  startContractScheduler();
  startNexusScheduler();
});
