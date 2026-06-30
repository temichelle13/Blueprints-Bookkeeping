export interface SchedulerRunRecord {
  lastRunAt: string | null;
  processedCount: number;
  errorCount: number;
}

export type SchedulerName =
  | "outboundEmailRetry"
  | "contract"
  | "nexus"
  | "inquiryRetention";

const state: Record<SchedulerName, SchedulerRunRecord> = {
  outboundEmailRetry: { lastRunAt: null, processedCount: 0, errorCount: 0 },
  contract: { lastRunAt: null, processedCount: 0, errorCount: 0 },
  nexus: { lastRunAt: null, processedCount: 0, errorCount: 0 },
  inquiryRetention: { lastRunAt: null, processedCount: 0, errorCount: 0 },
};

export function recordSchedulerRun(name: SchedulerName, processed = 0): void {
  state[name].lastRunAt = new Date().toISOString();
  state[name].processedCount += processed;
}

export function recordSchedulerError(name: SchedulerName): void {
  state[name].errorCount += 1;
}

export function getSchedulerHealth(): Record<
  SchedulerName,
  SchedulerRunRecord
> {
  return { ...state };
}
