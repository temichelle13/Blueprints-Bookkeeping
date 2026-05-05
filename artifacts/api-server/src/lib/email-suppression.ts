import { db, emailSuppressionListTable } from "@workspace/db";
import type { SuppressionReason } from "@workspace/db";
import { eq } from "drizzle-orm";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function isEmailSuppressed(email: string): Promise<boolean> {
  const normalized = normalizeEmail(email);
  const result = await db
    .select({ id: emailSuppressionListTable.id })
    .from(emailSuppressionListTable)
    .where(eq(emailSuppressionListTable.email, normalized))
    .limit(1);

  return result.length > 0;
}

export async function addToSuppressionList(
  email: string,
  reason: SuppressionReason,
): Promise<void> {
  const normalized = normalizeEmail(email);
  await db
    .insert(emailSuppressionListTable)
    .values({ email: normalized, reason })
    .onConflictDoNothing();
}
