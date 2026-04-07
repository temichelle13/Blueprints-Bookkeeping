import { db, emailSuppressionListTable } from "@workspace/db";
import type { SuppressionReason } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function isEmailSuppressed(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
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
  const normalized = email.trim().toLowerCase();
  await db
    .insert(emailSuppressionListTable)
    .values({ email: normalized, reason })
    .onConflictDoNothing();
}
