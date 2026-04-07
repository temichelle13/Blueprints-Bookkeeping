import { and, eq, lt, sql } from "drizzle-orm";
import { db, contactInquiriesTable } from "@workspace/db";
import { logger } from "./logger";

const ARCHIVE_AFTER_DAYS = 365;
const DELETE_AFTER_DAYS = 730;

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export async function runInquiryRetentionPolicy(): Promise<{
  archivedCount: number;
  deletedCount: number;
}> {
  const archiveCutoff = daysAgo(ARCHIVE_AFTER_DAYS);
  const deleteCutoff = daysAgo(DELETE_AFTER_DAYS);

  const archived = await db
    .update(contactInquiriesTable)
    .set({
      status: "Archived",
      name: "Archived Inquiry",
      email: sql`concat('archived+', ${contactInquiriesTable.id}, '@redacted.local')`,
      phone: null,
      message: null,
      businessName: null,
      industry: null,
      servicesInterested: null,
      monthlyRevenueRange: null,
      biggestChallenge: null,
      preferredContactMethod: null,
      requestIp: "redacted",
      userAgent: "redacted",
    })
    .where(
      and(
        lt(contactInquiriesTable.createdAt, archiveCutoff),
        eq(contactInquiriesTable.status, "Closed"),
      ),
    )
    .returning({ id: contactInquiriesTable.id });

  const deleted = await db
    .delete(contactInquiriesTable)
    .where(
      and(
        lt(contactInquiriesTable.createdAt, deleteCutoff),
        eq(contactInquiriesTable.status, "Archived"),
      ),
    )
    .returning({ id: contactInquiriesTable.id });

  if (archived.length > 0 || deleted.length > 0) {
    logger.info("Inquiry retention policy executed", {
      archivedCount: archived.length,
      deletedCount: deleted.length,
      archiveAfterDays: ARCHIVE_AFTER_DAYS,
      deleteAfterDays: DELETE_AFTER_DAYS,
    });
  }

  return {
    archivedCount: archived.length,
    deletedCount: deleted.length,
  };
}
