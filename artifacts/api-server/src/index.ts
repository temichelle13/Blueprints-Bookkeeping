import app from "./app";
import { checkAndSendReminders, syncAllPendingAgreements } from "./lib/contract-service";

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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  startContractScheduler();
});
