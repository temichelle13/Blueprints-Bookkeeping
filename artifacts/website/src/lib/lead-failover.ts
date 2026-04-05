import { getApiRoot } from "@/lib/api";

const STORAGE_KEY = "bb_pending_leads_v1";
const MAX_ENTRIES = 100;

type LeadKind = "contact" | "newsletter";

export type LeadFailoverEntry = {
  id: string;
  kind: LeadKind;
  createdAt: string;
  payload: Record<string, unknown>;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readQueue(): LeadFailoverEntry[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LeadFailoverEntry[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(entries: LeadFailoverEntry[]): void {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function createId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function queueLeadFailover(
  kind: LeadKind,
  payload: Record<string, unknown>,
): LeadFailoverEntry {
  const queue = readQueue();
  const entry: LeadFailoverEntry = {
    id: createId(),
    kind,
    createdAt: new Date().toISOString(),
    payload,
  };

  const next = [entry, ...queue].slice(0, MAX_ENTRIES);
  writeQueue(next);
  return entry;
}

async function retryContact(payload: Record<string, unknown>): Promise<void> {
  const response = await fetch(`${getApiRoot()}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Contact retry failed with status ${response.status}`);
  }
}

async function retryNewsletter(
  payload: Record<string, unknown>,
): Promise<void> {
  const response = await fetch(`${getApiRoot()}/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Newsletter retry failed with status ${response.status}`);
  }
}

export async function flushLeadFailoverQueue(): Promise<{
  processed: number;
  remaining: number;
}> {
  const queue = readQueue();
  if (!queue.length) {
    return { processed: 0, remaining: 0 };
  }

  const remaining: LeadFailoverEntry[] = [];
  let processed = 0;

  for (const entry of queue.reverse()) {
    try {
      if (entry.kind === "contact") {
        await retryContact(entry.payload);
      } else {
        await retryNewsletter(entry.payload);
      }
      processed += 1;
    } catch {
      remaining.unshift(entry);
    }
  }

  writeQueue(remaining);
  return { processed, remaining: remaining.length };
}

export function getLeadFailoverQueueSize(): number {
  return readQueue().length;
}
