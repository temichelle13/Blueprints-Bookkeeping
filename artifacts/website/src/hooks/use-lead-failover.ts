import { useEffect } from "react";
import { flushLeadFailoverQueue } from "@/lib/lead-failover";

const RETRY_INTERVAL_MS = 60_000;

export function useLeadFailoverRetry(): void {
  useEffect(() => {
    let cancelled = false;

    const flush = async () => {
      if (
        cancelled ||
        (typeof navigator !== "undefined" && !navigator.onLine)
      ) {
        return;
      }
      await flushLeadFailoverQueue();
    };

    void flush();

    const intervalId = window.setInterval(() => {
      void flush();
    }, RETRY_INTERVAL_MS);

    const handleOnline = () => {
      void flush();
    };

    window.addEventListener("online", handleOnline);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener("online", handleOnline);
    };
  }, []);
}
