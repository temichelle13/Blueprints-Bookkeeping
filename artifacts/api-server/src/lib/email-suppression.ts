import { EmailSuppressionModel } from "@workspace/db";
import type { SuppressionReason } from "@workspace/db";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function isEmailSuppressed(email: string): Promise<boolean> {
  const normalized = normalizeEmail(email);
  const result = await EmailSuppressionModel.exists({ email: normalized });
  return !!result;
}

export async function addToSuppressionList(
  email: string,
  reason: SuppressionReason,
): Promise<void> {
  const normalized = normalizeEmail(email);
  await EmailSuppressionModel.updateOne(
    { email: normalized },
    { email: normalized, reason },
    { upsert: true },
  );
}
