import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const outputPath = path.resolve("artifacts/website/public/downloads/financial-readiness-checklist.pdf");

const doc = new PDFDocument({
  size: "LETTER",
  margins: { top: 60, bottom: 60, left: 60, right: 60 },
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

const ACCENT = "#6366F1";
const DARK = "#1a1d2e";
const GRAY = "#6b7280";
const WHITE = "#ffffff";

doc.rect(0, 0, doc.page.width, 140).fill(DARK);

doc.rect(60, 120, doc.page.width - 120, 3).fill(ACCENT);

doc.fontSize(28).font("Helvetica-Bold").fillColor(WHITE)
  .text("Financial Readiness Checklist", 60, 45);

doc.fontSize(12).font("Helvetica").fillColor("#a5b4fc")
  .text("For Founders Ready to Scale", 60, 85);

doc.fontSize(10).font("Helvetica").fillColor("#9ca3af")
  .text("Blueprints & Bookkeeping, LLC  |  blueprintsandbookkeeping.com", 60, 105);

let y = 160;

doc.fontSize(11).font("Helvetica").fillColor(GRAY)
  .text(
    "Use this checklist to evaluate your financial infrastructure before approaching lenders, investors, or scaling operations. Each item represents a critical area that underwriters and financial partners will scrutinize.",
    60, y, { width: doc.page.width - 120, lineGap: 4 }
  );

y += 65;

const sections = [
  {
    title: "1. Revenue & Expense Tracking",
    items: [
      "All business income is recorded in a dedicated business account (no personal mixing)",
      "Revenue is categorized by stream/product line for clear reporting",
      "All expenses are categorized consistently using a standard chart of accounts",
      "Recurring vs. one-time expenses are clearly distinguished",
      "Monthly reconciliation is performed within 15 days of month-end",
    ],
  },
  {
    title: "2. Key Financial Ratios Lenders Evaluate",
    items: [
      "Debt-to-Equity Ratio is calculated and within healthy range (typically < 2:1)",
      "Current Ratio (current assets / current liabilities) is above 1.2",
      "Gross Profit Margin is documented and trending positively",
      "Operating Cash Flow is positive for the trailing 12 months",
      "Debt Service Coverage Ratio (DSCR) meets minimum lender threshold (typically > 1.25)",
    ],
  },
  {
    title: "3. Common Red Flags to Fix Now",
    items: [
      "No unclassified or \"Ask My Accountant\" transactions in your books",
      "No personal expenses running through business accounts",
      "Payroll tax filings are current with no outstanding liabilities",
      "Sales tax collection and remittance is up to date",
      "No duplicate entries, ghost vendors, or stale receivables over 90 days",
    ],
  },
  {
    title: "4. Lender-Readiness Timeline",
    items: [
      "3 years of clean, reconciled financial statements are available (P&L + Balance Sheet)",
      "Tax returns for the last 2-3 years are filed and accessible",
      "A 12-month cash flow projection has been prepared and stress-tested",
      "A 3-to-5-year business plan with financial forecasts is current",
      "An executive summary is ready for initial lender conversations",
    ],
  },
  {
    title: "5. Before You Hire a Bookkeeper",
    items: [
      "What is their experience with your industry and entity structure?",
      "Do they use your accounting software (e.g., QuickBooks Online)?",
      "Are they onshore and available year-round (no tax-season blackouts)?",
      "Can they provide lender-ready reports — not just data entry?",
      "Do they cap their client roster for quality assurance?",
    ],
  },
];

for (const section of sections) {
  if (y > doc.page.height - 160) {
    doc.addPage();
    y = 60;
  }

  doc.rect(60, y, 4, 18).fill(ACCENT);
  doc.fontSize(13).font("Helvetica-Bold").fillColor(DARK)
    .text(section.title, 72, y + 1);
  y += 30;

  for (const item of section.items) {
    if (y > doc.page.height - 80) {
      doc.addPage();
      y = 60;
    }

    doc.rect(72, y + 3, 12, 12).lineWidth(1.2).strokeColor(ACCENT).stroke();

    doc.fontSize(10).font("Helvetica").fillColor("#374151")
      .text(item, 92, y + 3, { width: doc.page.width - 160, lineGap: 2 });

    const textHeight = doc.heightOfString(item, { width: doc.page.width - 160 });
    y += Math.max(textHeight + 8, 22);
  }

  y += 12;
}

if (y > doc.page.height - 120) {
  doc.addPage();
  y = 60;
}

doc.rect(60, y, doc.page.width - 120, 1).fill("#e5e7eb");
y += 20;

doc.fontSize(12).font("Helvetica-Bold").fillColor(DARK)
  .text("Ready to Get Lender-Ready?", 60, y);
y += 22;
doc.fontSize(10).font("Helvetica").fillColor(GRAY)
  .text(
    "Blueprints & Bookkeeping specializes in advanced bookkeeping and lender-ready business plans for founders who have outgrown generalist solutions. We cap our roster at 20 active clients to ensure executive-level dedication.",
    60, y, { width: doc.page.width - 120, lineGap: 3 }
  );
y += 50;
doc.fontSize(10).font("Helvetica-Bold").fillColor(ACCENT)
  .text("Schedule your free discovery call:", 60, y);
doc.font("Helvetica").fillColor(GRAY)
  .text("blueprintsandbookkeeping.com/contact", 60, y + 16);
doc.text("tea@blueprintsandbookkeeping.com  |  (541) 319-8654", 60, y + 30);

doc.end();

stream.on("finish", () => {
  console.log(`PDF created at: ${outputPath}`);
});
