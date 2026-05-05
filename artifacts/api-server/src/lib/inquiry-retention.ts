import { ContactInquiryModel } from "@workspace/db";
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

  const archivedResult = await ContactInquiryModel.updateMany(
    { createdAt: { $lt: archiveCutoff }, status: "Closed" },
    {
      $set: {
        status: "Archived",
        name: "Archived Inquiry",
        email: "archived@redacted.local",
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
      },
    },
  );

  const deletedResult = await ContactInquiryModel.deleteMany({
    createdAt: { $lt: deleteCutoff },
    status: "Archived",
  });

  const archivedCount = archivedResult.modifiedCount;
  const deletedCount = deletedResult.deletedCount;

  if (archivedCount > 0 || deletedCount > 0) {
    logger.info("Inquiry retention policy executed", {
      archivedCount,
      deletedCount,
      archiveAfterDays: ARCHIVE_AFTER_DAYS,
      deleteAfterDays: DELETE_AFTER_DAYS,
    });
  }

  return { archivedCount, deletedCount };
}
