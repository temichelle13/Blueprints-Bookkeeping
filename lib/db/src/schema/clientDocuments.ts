import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";

export const clientDocumentsTable = pgTable("client_documents", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  storagePath: text("storage_path").notNull(),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ClientDocument = typeof clientDocumentsTable.$inferSelect;
export type InsertClientDocument = typeof clientDocumentsTable.$inferInsert;
