import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "..", "artifacts", "website", "public", "downloads");
const LOGO_PATH = path.join(__dirname, "..", "artifacts", "website", "public", "logo.png");

const NAVY = "#1B2A5A";
const PERIWINKLE = "#5B5EA6";
const LIGHT_BG = "#F4F6FA";
const WHITE = "#FFFFFF";
const DARK_TEXT = "#1E293B";
const MUTED_TEXT = "#64748B";

function createDoc() {
  return new PDFDocument({ size: "LETTER", margins: { top: 60, bottom: 60, left: 55, right: 55 } });
}

function addHeader(doc, title, subtitle) {
  doc.rect(0, 0, doc.page.width, 110).fill(NAVY);
  if (fs.existsSync(LOGO_PATH)) {
    doc.image(LOGO_PATH, 55, 20, { width: 50 });
  }
  doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(22).text(title, 115, 28, { width: doc.page.width - 170 });
  doc.fillColor(PERIWINKLE).font("Helvetica").fontSize(11).text(subtitle || "Blueprints & Bookkeeping, LLC", 115, 58, { width: doc.page.width - 170 });
  doc.fillColor(WHITE).font("Helvetica").fontSize(8).text("blueprintsandbookkeeping.com", 115, 78, { width: doc.page.width - 170 });
  doc.moveDown(3);
  doc.y = 130;
}

function addFooter(doc) {
  const y = doc.page.height - 45;
  doc.rect(0, y - 5, doc.page.width, 50).fill(NAVY);
  doc.fillColor(WHITE).font("Helvetica").fontSize(7.5)
    .text("Blueprints & Bookkeeping, LLC | tea@blueprintsandbookkeeping.com | (541) 319-8654 | blueprintsandbookkeeping.com", 55, y + 5, { align: "center", width: doc.page.width - 110 });
}

function addSectionTitle(doc, text) {
  doc.fillColor(NAVY).font("Helvetica-Bold").fontSize(14).text(text);
  doc.moveTo(doc.x, doc.y + 2).lineTo(doc.x + 200, doc.y + 2).lineWidth(2).strokeColor(PERIWINKLE).stroke();
  doc.moveDown(0.6);
}

function addSubsection(doc, text) {
  doc.fillColor(PERIWINKLE).font("Helvetica-Bold").fontSize(11).text(text);
  doc.moveDown(0.3);
}

function addParagraph(doc, text) {
  doc.fillColor(DARK_TEXT).font("Helvetica").fontSize(10).text(text, { lineGap: 3 });
  doc.moveDown(0.5);
}

function addChecklistItem(doc, text) {
  const x = doc.x;
  const y = doc.y;
  doc.rect(x, y + 2, 10, 10).lineWidth(1).strokeColor(PERIWINKLE).stroke();
  doc.fillColor(DARK_TEXT).font("Helvetica").fontSize(10).text(text, x + 16, y, { width: doc.page.width - 126 });
  doc.moveDown(0.3);
}

function addBulletItem(doc, text) {
  const x = doc.x;
  const y = doc.y;
  doc.circle(x + 3, y + 5, 2.5).fill(PERIWINKLE);
  doc.fillColor(DARK_TEXT).font("Helvetica").fontSize(10).text(text, x + 12, y, { width: doc.page.width - 122 });
  doc.moveDown(0.3);
}

function addNumberedItem(doc, num, title, description) {
  const x = doc.x;
  const y = doc.y;
  doc.circle(x + 8, y + 6, 10).fill(PERIWINKLE);
  doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(9).text(String(num), x + 3, y + 1.5, { width: 12, align: "center" });
  doc.fillColor(NAVY).font("Helvetica-Bold").fontSize(10).text(title, x + 24, y);
  if (description) {
    doc.fillColor(DARK_TEXT).font("Helvetica").fontSize(9.5).text(description, x + 24, doc.y, { width: doc.page.width - 134 });
  }
  doc.moveDown(0.5);
}

function addCTA(doc) {
  doc.moveDown(1);
  doc.rect(55, doc.y, doc.page.width - 110, 60).fill(LIGHT_BG);
  const boxY = doc.y;
  doc.fillColor(NAVY).font("Helvetica-Bold").fontSize(12).text("Ready to Get Started?", 70, boxY + 10, { width: doc.page.width - 140 });
  doc.fillColor(MUTED_TEXT).font("Helvetica").fontSize(9.5).text("Schedule a free discovery call at blueprintsandbookkeeping.com/schedule or email tea@blueprintsandbookkeeping.com", 70, boxY + 28, { width: doc.page.width - 140 });
}

function checkPage(doc, needed = 120) {
  if (doc.y > doc.page.height - needed - 60) {
    addFooter(doc);
    doc.addPage();
    doc.y = 60;
  }
}

function saveDoc(doc, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(OUTPUT_DIR, filename);
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);
    doc.end();
    stream.on("finish", () => { console.log(`  ✓ ${filename}`); resolve(); });
    stream.on("error", reject);
  });
}

function generateFinancialReadinessChecklist() {
  const doc = createDoc();
  addHeader(doc, "Financial Readiness Checklist", "For Founders Ready to Scale");

  addSectionTitle(doc, "1. Revenue & Expense Tracking");
  addChecklistItem(doc, "All business income is recorded in a dedicated business account (no personal mixing)");
  addChecklistItem(doc, "Revenue is categorized by stream/product line for clear reporting");
  addChecklistItem(doc, "All expenses are categorized consistently using a standard chart of accounts");
  addChecklistItem(doc, "Recurring vs. one-time expenses are clearly distinguished");
  addChecklistItem(doc, "Monthly reconciliation is performed within 15 days of month-end");
  doc.moveDown(0.5);

  addSectionTitle(doc, "2. Key Financial Ratios Lenders Evaluate");
  addChecklistItem(doc, "Debt-to-Equity Ratio is calculated and within healthy range (typically < 2:1)");
  addChecklistItem(doc, "Current Ratio (current assets / current liabilities) is above 1.2");
  addChecklistItem(doc, "Gross Profit Margin is documented and trending positively");
  addChecklistItem(doc, "Operating Cash Flow is positive for the trailing 12 months");
  addChecklistItem(doc, "Debt Service Coverage Ratio (DSCR) meets minimum lender threshold (typically > 1.25)");
  doc.moveDown(0.5);

  addSectionTitle(doc, "3. Common Red Flags to Fix Now");
  addChecklistItem(doc, 'No unclassified or "Ask My Accountant" transactions in your books');
  addChecklistItem(doc, "No personal expenses running through business accounts");
  addChecklistItem(doc, "Payroll tax filings are current with no outstanding liabilities");
  addChecklistItem(doc, "Sales tax collection and remittance is up to date");
  addChecklistItem(doc, "No duplicate entries, ghost vendors, or stale receivables over 90 days");
  doc.moveDown(0.5);

  checkPage(doc, 200);

  addSectionTitle(doc, "4. Lender-Readiness Timeline");
  addChecklistItem(doc, "3 years of clean, reconciled financial statements are available (P&L + Balance Sheet)");
  addChecklistItem(doc, "Tax returns for the last 2–3 years are filed and accessible");
  addChecklistItem(doc, "A 12-month cash flow projection has been prepared and stress-tested");
  addChecklistItem(doc, "A 3-to-5-year business plan with financial forecasts is current");
  addChecklistItem(doc, "An executive summary is ready for initial lender conversations");
  doc.moveDown(0.5);

  addSectionTitle(doc, "5. Before You Hire a Bookkeeper");
  addChecklistItem(doc, "What is their experience with your industry and entity structure?");
  addChecklistItem(doc, "Do they use your accounting software (e.g., QuickBooks Online)?");
  addChecklistItem(doc, "Are they onshore and available year-round (no tax-season blackouts)?");
  addChecklistItem(doc, "Can they provide lender-ready reports — not just data entry?");
  addChecklistItem(doc, "Do they cap their client roster for quality assurance?");

  addCTA(doc);
  addFooter(doc);
  return saveDoc(doc, "financial-readiness-checklist.pdf");
}

function generateMonthlyCloseChecklist() {
  const doc = createDoc();
  addHeader(doc, "Monthly Close Checklist", "Step-by-Step Month-End Procedure");

  addSectionTitle(doc, "Week 1: Transaction Review");
  addChecklistItem(doc, "Download and review all bank statements for the month");
  addChecklistItem(doc, "Download and review all credit card statements");
  addChecklistItem(doc, "Match receipts to transactions and file documentation");
  addChecklistItem(doc, "Categorize all uncategorized transactions");
  addChecklistItem(doc, "Review and approve any pending expense reports");
  doc.moveDown(0.5);

  addSectionTitle(doc, "Week 2: Reconciliation");
  addChecklistItem(doc, "Reconcile all bank accounts to statements");
  addChecklistItem(doc, "Reconcile all credit card accounts to statements");
  addChecklistItem(doc, "Reconcile PayPal, Stripe, and other payment processor accounts");
  addChecklistItem(doc, "Reconcile petty cash (if applicable)");
  addChecklistItem(doc, "Investigate and resolve any discrepancies");
  doc.moveDown(0.5);

  addSectionTitle(doc, "Week 3: Adjustments & Accruals");
  addChecklistItem(doc, "Record depreciation entries for fixed assets");
  addChecklistItem(doc, "Record amortization of prepaid expenses");
  addChecklistItem(doc, "Accrue any unpaid bills or earned revenue");
  addChecklistItem(doc, "Record payroll journal entries and verify payroll tax liabilities");
  addChecklistItem(doc, "Adjust inventory counts (if applicable)");
  addChecklistItem(doc, "Record loan interest accruals");
  doc.moveDown(0.5);

  checkPage(doc, 220);

  addSectionTitle(doc, "Week 4: Review & Reporting");
  addChecklistItem(doc, "Run Profit & Loss statement and compare to prior month and budget");
  addChecklistItem(doc, "Run Balance Sheet and verify all accounts are reasonable");
  addChecklistItem(doc, "Review Accounts Receivable aging — follow up on 30+ day invoices");
  addChecklistItem(doc, "Review Accounts Payable aging — schedule payments");
  addChecklistItem(doc, "Generate Cash Flow Statement");
  addChecklistItem(doc, "Document any unusual items or one-time expenses");
  addChecklistItem(doc, "Archive monthly close package (statements, reports, reconciliations)");

  addCTA(doc);
  addFooter(doc);
  return saveDoc(doc, "monthly-close-checklist.pdf");
}

function generateChartOfAccounts() {
  const doc = createDoc();
  addHeader(doc, "Chart of Accounts Template", "Starter Template for Small Businesses");

  addParagraph(doc, "A well-organized chart of accounts is the foundation of clean bookkeeping. Use this template as a starting point and customize for your specific industry and business structure.");
  doc.moveDown(0.3);

  const categories = [
    { title: "1000–1999: Assets", items: [
      "1000 — Cash (Operating Checking Account)", "1010 — Cash (Savings / Reserve Account)", "1020 — Petty Cash",
      "1100 — Accounts Receivable", "1200 — Prepaid Expenses", "1300 — Inventory",
      "1500 — Fixed Assets (Equipment)", "1510 — Fixed Assets (Furniture & Fixtures)",
      "1550 — Accumulated Depreciation", "1600 — Security Deposits"
    ]},
    { title: "2000–2999: Liabilities", items: [
      "2000 — Accounts Payable", "2100 — Credit Card Payable", "2200 — Payroll Liabilities",
      "2210 — Federal Tax Withholding Payable", "2220 — State Tax Withholding Payable",
      "2300 — Sales Tax Payable", "2400 — Short-Term Loans Payable",
      "2500 — Long-Term Loans Payable", "2600 — Line of Credit"
    ]},
    { title: "3000–3999: Equity", items: [
      "3000 — Owner's Equity / Capital", "3100 — Owner's Draw / Distributions",
      "3200 — Retained Earnings", "3300 — Additional Paid-In Capital"
    ]},
    { title: "4000–4999: Revenue", items: [
      "4000 — Service Revenue (Primary)", "4010 — Service Revenue (Secondary)",
      "4100 — Product Sales Revenue", "4200 — Interest Income",
      "4300 — Other Income", "4400 — Refunds & Allowances (contra)"
    ]},
    { title: "5000–5999: Cost of Goods Sold", items: [
      "5000 — Cost of Services (Labor)", "5100 — Cost of Materials / Supplies",
      "5200 — Subcontractor Costs", "5300 — Shipping & Freight Costs"
    ]},
    { title: "6000–6999: Operating Expenses", items: [
      "6000 — Advertising & Marketing", "6010 — Website & Online Services",
      "6100 — Bank & Merchant Fees", "6200 — Insurance (General Liability)",
      "6210 — Insurance (Professional / E&O)", "6300 — Office Supplies",
      "6400 — Rent / Lease Expense", "6500 — Utilities (Electric, Internet, Phone)",
      "6600 — Professional Services (Legal, Accounting)", "6700 — Payroll Expense",
      "6710 — Payroll Tax Expense", "6800 — Travel & Meals (50% deductible)",
      "6900 — Depreciation Expense", "6950 — Miscellaneous Expense"
    ]}
  ];

  for (const cat of categories) {
    checkPage(doc, 80 + cat.items.length * 16);
    addSubsection(doc, cat.title);
    for (const item of cat.items) {
      addBulletItem(doc, item);
    }
    doc.moveDown(0.4);
  }

  addCTA(doc);
  addFooter(doc);
  return saveDoc(doc, "chart-of-accounts-template.pdf");
}

function generateExpenseCategorizationGuide() {
  const doc = createDoc();
  addHeader(doc, "Expense Categorization Guide", "Quick Reference with IRS Category Mappings");

  addParagraph(doc, "Correctly categorizing expenses ensures clean books, accurate tax filings, and maximized deductions. This guide maps common business expenses to their proper categories and IRS Schedule C lines.");
  doc.moveDown(0.3);

  const sections = [
    { title: "Office & Administration", items: [
      ["Office Supplies", "Pens, paper, printer ink, postage", "Schedule C, Line 18"],
      ["Software Subscriptions", "QuickBooks, Zoom, Slack, project tools", "Schedule C, Line 18 or 27a"],
      ["Phone & Internet", "Business phone line, internet service", "Schedule C, Line 25"],
      ["Postage & Shipping", "USPS, FedEx, UPS for business", "Schedule C, Line 18"],
    ]},
    { title: "Professional Services", items: [
      ["Accounting & Bookkeeping", "Tax prep, monthly bookkeeping fees", "Schedule C, Line 17"],
      ["Legal Fees", "Business formation, contracts, counsel", "Schedule C, Line 17"],
      ["Consulting", "Business advisors, coaches", "Schedule C, Line 11"],
    ]},
    { title: "Marketing & Sales", items: [
      ["Advertising", "Google Ads, Facebook Ads, print ads", "Schedule C, Line 8"],
      ["Website Hosting", "Domain, hosting, SSL certificates", "Schedule C, Line 8"],
      ["Business Cards & Branding", "Cards, brochures, logo design", "Schedule C, Line 8"],
    ]},
    { title: "Travel & Meals", items: [
      ["Business Travel", "Airfare, hotel, rental car for business", "Schedule C, Line 24a"],
      ["Business Meals", "Client meals, team meals (50% deductible)", "Schedule C, Line 24b"],
      ["Vehicle (Actual)", "Gas, maintenance, insurance for biz use", "Schedule C, Line 9"],
      ["Vehicle (Standard Mileage)", "IRS rate × business miles driven", "Schedule C, Line 9"],
    ]},
    { title: "Insurance", items: [
      ["General Liability", "Business liability insurance premiums", "Schedule C, Line 15"],
      ["Professional Liability (E&O)", "Errors & omissions coverage", "Schedule C, Line 15"],
      ["Health Insurance (Self-Employed)", "Premiums for owner", "Form 1040, Line 17"],
    ]},
    { title: "Payroll & Contractors", items: [
      ["Wages & Salaries", "Employee compensation", "Schedule C, Line 26"],
      ["Payroll Taxes", "Employer FICA, FUTA, SUTA", "Schedule C, Line 23"],
      ["Contract Labor", "1099 independent contractors", "Schedule C, Line 11"],
    ]},
  ];

  for (const section of sections) {
    checkPage(doc, 60 + section.items.length * 40);
    addSectionTitle(doc, section.title);
    for (const [name, desc, irs] of section.items) {
      doc.fillColor(NAVY).font("Helvetica-Bold").fontSize(10).text(name);
      doc.fillColor(DARK_TEXT).font("Helvetica").fontSize(9).text(desc);
      doc.fillColor(PERIWINKLE).font("Helvetica-Oblique").fontSize(8.5).text(`IRS: ${irs}`);
      doc.moveDown(0.4);
    }
    doc.moveDown(0.3);
  }

  addCTA(doc);
  addFooter(doc);
  return saveDoc(doc, "expense-categorization-guide.pdf");
}

function generateSBALoanPrepChecklist() {
  const doc = createDoc();
  addHeader(doc, "SBA Loan Application Prep Checklist", "Every Document You Need Before Applying");

  addParagraph(doc, "SBA loan applications require extensive documentation. Use this checklist to gather everything before you start — being prepared dramatically increases approval speed and odds.");
  doc.moveDown(0.5);

  const sections = [
    { title: "Personal Documentation", items: [
      "Government-issued photo ID for all owners with 20%+ stake",
      "Personal financial statement (SBA Form 413) for each owner",
      "Personal tax returns — last 3 years (all schedules)",
      "Resume or CV for each principal/owner",
      "Personal credit report (pulled within 30 days)",
    ]},
    { title: "Business Documentation", items: [
      "Business tax returns — last 3 years (all schedules)",
      "Year-to-date Profit & Loss statement",
      "Year-to-date Balance Sheet",
      "Business debt schedule (all existing loans, lines of credit)",
      "Business lease or property ownership documents",
      "Articles of Incorporation / Organization / Partnership Agreement",
      "Business licenses and permits",
      "EIN verification letter (IRS Letter 147C)",
    ]},
    { title: "Financial Projections", items: [
      "3-year revenue and expense projections with assumptions",
      "12-month cash flow forecast",
      "Break-even analysis",
      "Use-of-funds statement (exactly how loan proceeds will be spent)",
    ]},
    { title: "Business Plan Components", items: [
      "Executive summary",
      "Company description and history",
      "Market analysis and competitive landscape",
      "Management team bios and org chart",
      "Products/services description",
      "Marketing and sales strategy",
      "Financial projections with narrative explanations",
    ]},
    { title: "Collateral Documentation", items: [
      "List of business assets (equipment, inventory, real estate)",
      "Appraisals for real property offered as collateral",
      "Equipment valuations or recent purchase invoices",
      "Accounts receivable aging report",
      "Inventory listing with valuations",
    ]},
    { title: "Additional Requirements", items: [
      "SBA Form 1919 (Borrower Information Form)",
      "SBA Form 912 (Statement of Personal History)",
      "IRS Form 4506-C (Request for Transcript of Tax Return)",
      "Bank statements — last 12 months (all business accounts)",
      "Proof of business insurance",
    ]},
  ];

  for (const section of sections) {
    checkPage(doc, 60 + section.items.length * 18);
    addSectionTitle(doc, section.title);
    for (const item of section.items) {
      addChecklistItem(doc, item);
    }
    doc.moveDown(0.4);
  }

  addCTA(doc);
  addFooter(doc);
  return saveDoc(doc, "sba-loan-prep-checklist.pdf");
}

function generateFinancialProjectionWorksheet() {
  const doc = createDoc();
  addHeader(doc, "3-Year Financial Projection Worksheet", "Revenue Forecasting & Cash Flow Framework");

  addParagraph(doc, "Use this worksheet to build your 3-year financial projections. Lenders and investors want to see realistic assumptions backed by data. Complete each section with your best estimates, then refine with actual performance data.");
  doc.moveDown(0.5);

  addSectionTitle(doc, "Revenue Assumptions");
  addChecklistItem(doc, "Primary revenue stream: _________________ Projected monthly: $________");
  addChecklistItem(doc, "Secondary revenue stream: ________________ Projected monthly: $________");
  addChecklistItem(doc, "Expected year-over-year growth rate: ________%");
  addChecklistItem(doc, "Seasonal peaks (months): _________________");
  addChecklistItem(doc, "Seasonal troughs (months): ________________");
  addChecklistItem(doc, "Average transaction/contract value: $________");
  addChecklistItem(doc, "Expected number of customers/contracts per month: ________");
  doc.moveDown(0.5);

  addSectionTitle(doc, "Year 1 Monthly Revenue Forecast");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (const month of months) {
    addChecklistItem(doc, `${month}: Revenue $________ | Customers ________ | Avg Value $________`);
  }
  doc.moveDown(0.5);

  checkPage(doc, 250);

  addSectionTitle(doc, "Expense Categories — Monthly Estimates");
  const expenses = [
    "Rent / Lease", "Payroll & Benefits", "Utilities & Internet", "Insurance",
    "Marketing & Advertising", "Software & Subscriptions", "Professional Services",
    "Supplies & Materials", "Vehicle / Travel", "Loan Payments", "Miscellaneous"
  ];
  for (const exp of expenses) {
    addChecklistItem(doc, `${exp}: Year 1 $_______/mo | Year 2 $_______/mo | Year 3 $_______/mo`);
  }
  doc.moveDown(0.5);

  checkPage(doc, 200);

  addSectionTitle(doc, "3-Year Summary Projections");
  addChecklistItem(doc, "Year 1: Total Revenue $________ | Total Expenses $________ | Net Income $________");
  addChecklistItem(doc, "Year 2: Total Revenue $________ | Total Expenses $________ | Net Income $________");
  addChecklistItem(doc, "Year 3: Total Revenue $________ | Total Expenses $________ | Net Income $________");
  doc.moveDown(0.5);

  addSectionTitle(doc, "Key Assumptions to Document");
  addBulletItem(doc, "What data supports your revenue projections? (industry benchmarks, existing sales, contracts)");
  addBulletItem(doc, "What pricing model are you using? How was it validated?");
  addBulletItem(doc, "What is your customer acquisition cost (CAC) and how will it change?");
  addBulletItem(doc, "What is your break-even point (units/revenue)?");
  addBulletItem(doc, "What are your biggest financial risks and mitigation strategies?");

  addCTA(doc);
  addFooter(doc);
  return saveDoc(doc, "financial-projection-worksheet.pdf");
}

function generateBusinessPlanOutline() {
  const doc = createDoc();
  addHeader(doc, "Business Plan Outline Template", "SBA/Lender-Ready Section-by-Section Guide");

  addParagraph(doc, "This outline follows the format expected by SBA lenders, banks, and investors. Each section includes prompts to guide your writing. A strong business plan typically runs 20–40 pages.");
  doc.moveDown(0.5);

  const sections = [
    { num: 1, title: "Executive Summary (1–2 pages)", prompts: [
      "What does your company do in one sentence?",
      "What problem do you solve and for whom?",
      "What is your competitive advantage?",
      "Key financial highlights (revenue, growth, profitability)",
      "How much funding are you seeking and how will you use it?",
      "What are your 3-year goals?",
    ]},
    { num: 2, title: "Company Description (2–3 pages)", prompts: [
      "Legal structure (LLC, Corp, Partnership, Sole Prop)",
      "Date founded, state of incorporation, DBA names",
      "Mission statement and vision",
      "Company history and key milestones",
      "Location(s) and facilities description",
      "Products or services overview",
    ]},
    { num: 3, title: "Market Analysis (3–5 pages)", prompts: [
      "Industry overview and current trends",
      "Total addressable market (TAM) size and growth rate",
      "Target customer demographics and psychographics",
      "Customer pain points your business addresses",
      "Competitive landscape — direct and indirect competitors",
      "Your competitive advantages and differentiators",
      "Market entry or expansion strategy",
    ]},
    { num: 4, title: "Organization & Management (2–3 pages)", prompts: [
      "Organizational chart",
      "Bios of key team members with relevant experience",
      "Board of Directors or Advisory Board (if applicable)",
      "Staffing plan and hiring timeline",
      "Key positions to fill and requirements",
    ]},
    { num: 5, title: "Products & Services (2–3 pages)", prompts: [
      "Detailed description of each product/service",
      "Pricing strategy and rationale",
      "Product lifecycle and development roadmap",
      "Intellectual property (patents, trademarks, copyrights)",
      "Supplier and vendor relationships",
    ]},
    { num: 6, title: "Marketing & Sales Strategy (3–4 pages)", prompts: [
      "Brand positioning statement",
      "Marketing channels and budget allocation",
      "Sales process and customer journey",
      "Customer acquisition cost (CAC) targets",
      "Retention and loyalty strategies",
      "Key partnerships and referral programs",
    ]},
    { num: 7, title: "Financial Projections (5–8 pages)", prompts: [
      "3-year projected Income Statement (monthly Year 1, annual Years 2–3)",
      "3-year projected Balance Sheet",
      "3-year projected Cash Flow Statement",
      "Break-even analysis with chart",
      "Key financial assumptions and rationale",
      "Funding request and use-of-funds breakdown",
    ]},
    { num: 8, title: "Appendix", prompts: [
      "Resumes of key personnel",
      "Personal financial statements",
      "Tax returns (personal and business, last 3 years)",
      "Contracts, leases, and agreements",
      "Letters of intent or purchase orders",
      "Supporting market research data",
    ]},
  ];

  for (const section of sections) {
    checkPage(doc, 50 + section.prompts.length * 16);
    addNumberedItem(doc, section.num, section.title);
    for (const prompt of section.prompts) {
      addBulletItem(doc, prompt);
    }
    doc.moveDown(0.4);
  }

  addCTA(doc);
  addFooter(doc);
  return saveDoc(doc, "business-plan-outline.pdf");
}

function generateCryptoTransactionLog() {
  const doc = createDoc();
  addHeader(doc, "Crypto Transaction Log Template", "Track Wallet Transfers, Trades & DeFi Activity");

  addParagraph(doc, "Accurate crypto transaction records are essential for tax compliance and portfolio management. Use this template to log every transaction type. Keep this updated throughout the year — reconstructing records at tax time is costly and error-prone.");
  doc.moveDown(0.5);

  addSectionTitle(doc, "Exchange Trades");
  addParagraph(doc, "Record every buy, sell, and trade on centralized exchanges (Coinbase, Kraken, Binance, etc.):");
  const tradeFields = ["Date & time of trade", "Exchange name", "Trading pair (e.g., BTC/USD)", "Transaction type (Buy / Sell / Trade)", "Amount of crypto acquired or sold", "Price per unit at time of trade (USD)", "Total value in USD", "Fees paid (trading fee + network fee)", "Resulting cost basis per unit", "Notes (reason for trade, strategy)"];
  for (const f of tradeFields) addChecklistItem(doc, f);
  doc.moveDown(0.5);

  checkPage(doc, 200);

  addSectionTitle(doc, "Wallet Transfers");
  addParagraph(doc, "Track all movements between wallets and exchanges:");
  const walletFields = ["Date & time of transfer", "From wallet/exchange", "To wallet/exchange", "Cryptocurrency and amount", "Network/gas fee paid", "Transaction hash (TXID)", "Purpose of transfer"];
  for (const f of walletFields) addChecklistItem(doc, f);
  doc.moveDown(0.5);

  checkPage(doc, 200);

  addSectionTitle(doc, "Staking & Yield");
  addParagraph(doc, "Record staking rewards, interest, and yield farming income:");
  const stakingFields = ["Date received", "Platform/protocol name", "Cryptocurrency and amount received", "Fair market value in USD at time received", "Type (staking reward / interest / yield / airdrop)", "Associated cost basis"];
  for (const f of stakingFields) addChecklistItem(doc, f);
  doc.moveDown(0.5);

  checkPage(doc, 200);

  addSectionTitle(doc, "DeFi Activity");
  addParagraph(doc, "Document decentralized finance transactions:");
  const defiFields = ["Date & time", "Protocol name (Uniswap, Aave, etc.)", "Action (swap / provide liquidity / borrow / lend)", "Tokens involved and amounts", "Gas fees paid", "Fair market value at time of transaction", "Contract address"];
  for (const f of defiFields) addChecklistItem(doc, f);

  addCTA(doc);
  addFooter(doc);
  return saveDoc(doc, "crypto-transaction-log.pdf");
}

function generateDigitalAssetTaxOrganizer() {
  const doc = createDoc();
  addHeader(doc, "Digital Asset Tax Prep Organizer", "Everything Your Tax Preparer Needs");

  addParagraph(doc, "If you hold, buy, sell, or earn cryptocurrency, your tax preparer needs specific documentation. Gather everything on this list before your tax appointment to avoid delays and ensure accurate reporting.");
  doc.moveDown(0.5);

  addSectionTitle(doc, "General Information");
  addChecklistItem(doc, "Full legal name and SSN/EIN");
  addChecklistItem(doc, "List of all exchanges used during the tax year");
  addChecklistItem(doc, "List of all wallets used (hardware, software, custodial)");
  addChecklistItem(doc, "List of all cryptocurrencies held or transacted");
  doc.moveDown(0.5);

  addSectionTitle(doc, "Transaction Records");
  addChecklistItem(doc, "Annual transaction reports from each exchange (CSV or PDF)");
  addChecklistItem(doc, "Tax reports from exchange platforms (e.g., Coinbase Tax Center)");
  addChecklistItem(doc, "On-chain transaction history for each wallet address");
  addChecklistItem(doc, "DeFi transaction records (swaps, liquidity, lending)");
  addChecklistItem(doc, "NFT purchase and sale records");
  addChecklistItem(doc, "Crypto-to-crypto trade records with USD fair market values");
  doc.moveDown(0.5);

  addSectionTitle(doc, "Income from Digital Assets");
  addChecklistItem(doc, "Mining income — amount and fair market value when received");
  addChecklistItem(doc, "Staking rewards — amount and fair market value when received");
  addChecklistItem(doc, "Airdrop receipts — amount and fair market value when received");
  addChecklistItem(doc, "Interest earned from lending platforms");
  addChecklistItem(doc, "Payment received in crypto for goods or services");
  addChecklistItem(doc, "Hard fork proceeds");
  doc.moveDown(0.5);

  checkPage(doc, 200);

  addSectionTitle(doc, "Cost Basis Information");
  addChecklistItem(doc, "Original purchase date and price for each holding");
  addChecklistItem(doc, "Cost basis method used (FIFO, LIFO, Specific ID)");
  addChecklistItem(doc, "Documentation for gifted or inherited crypto");
  addChecklistItem(doc, "Records of any lost, stolen, or abandoned crypto");
  doc.moveDown(0.5);

  addSectionTitle(doc, "Compliance & Reporting");
  addChecklistItem(doc, "IRS Form 8949 (Sales and Dispositions of Capital Assets)");
  addChecklistItem(doc, "Schedule D (Capital Gains and Losses)");
  addChecklistItem(doc, "FBAR filing if foreign exchange balances exceeded $10,000");
  addChecklistItem(doc, "Form 8938 (FATCA) if applicable thresholds are met");
  addChecklistItem(doc, "Answer to IRS digital asset question on Form 1040");

  addCTA(doc);
  addFooter(doc);
  return saveDoc(doc, "digital-asset-tax-organizer.pdf");
}

function generateEntitySetupChecklist() {
  const doc = createDoc();
  addHeader(doc, "New Business Entity Setup Checklist", "LLC/Corp Formation Guide (Oregon + Nationwide)");

  addParagraph(doc, "Setting up a business entity correctly from the start prevents costly problems later. This step-by-step guide covers the key actions for forming an LLC or Corporation, with Oregon-specific details and nationwide notes.");
  doc.moveDown(0.5);

  const sections = [
    { title: "Step 1: Choose Your Entity Type", items: [
      "Research entity types: Sole Proprietorship, LLC, S-Corp, C-Corp, Partnership",
      "Consult with an attorney or CPA on tax implications of each structure",
      "Consider liability protection, tax treatment, and ownership flexibility",
      "Decide on single-member vs. multi-member (LLC) or stock structure (Corp)",
    ]},
    { title: "Step 2: Name Your Business", items: [
      "Search Oregon Secretary of State business name database",
      "Check federal trademark database (USPTO TESS)",
      "Verify domain name availability",
      "Reserve your business name (Oregon: $100 online)",
      "File a DBA/Assumed Business Name if using a trade name",
    ]},
    { title: "Step 3: File Formation Documents", items: [
      "Oregon LLC: File Articles of Organization with Secretary of State ($100)",
      "Oregon Corp: File Articles of Incorporation ($100)",
      "Designate a Registered Agent in Oregon",
      "Other states: File in your state of organization + foreign registration where operating",
    ]},
    { title: "Step 4: Get Your EIN & Tax Setup", items: [
      "Apply for EIN (Employer Identification Number) at IRS.gov — free",
      "Register with Oregon Department of Revenue",
      "Register for Oregon Combined Payroll Tax if hiring employees",
      "Determine sales tax obligations (Oregon has no sales tax, but other states may)",
      "Elect S-Corp tax status with IRS if desired (Form 2553, within 75 days)",
    ]},
    { title: "Step 5: Business Operations Setup", items: [
      "Open a dedicated business bank account",
      "Get a business credit card",
      "Set up accounting software (QuickBooks Online recommended)",
      "Purchase business insurance (general liability, professional liability)",
      "Draft Operating Agreement (LLC) or Bylaws (Corp)",
      "Obtain necessary business licenses and permits",
    ]},
    { title: "Step 6: Ongoing Compliance", items: [
      "Oregon Annual Report filing ($100, due on anniversary of formation)",
      "Maintain registered agent and keep address current",
      "File annual tax returns (federal and state)",
      "Keep corporate records and meeting minutes",
      "Renew business licenses as required",
    ]},
  ];

  for (const section of sections) {
    checkPage(doc, 50 + section.items.length * 18);
    addSectionTitle(doc, section.title);
    for (const item of section.items) addChecklistItem(doc, item);
    doc.moveDown(0.4);
  }

  addCTA(doc);
  addFooter(doc);
  return saveDoc(doc, "entity-setup-checklist.pdf");
}

function generateContractorVsEmployee() {
  const doc = createDoc();
  addHeader(doc, "Contractor vs Employee Decision Matrix", "IRS Classification Framework");

  addParagraph(doc, "Misclassifying workers can result in back taxes, penalties, and legal liability. Use this framework based on IRS guidelines to evaluate whether a worker should be classified as an independent contractor or employee.");
  doc.moveDown(0.5);

  addSectionTitle(doc, "Behavioral Control");
  addParagraph(doc, "Does the company control or have the right to control what the worker does and how they do it?");
  const behavioral = [
    ["Instructions", "Employee: Company provides detailed instructions on when, where, and how to work. | Contractor: Worker determines their own methods and schedule."],
    ["Training", "Employee: Company provides training on procedures. | Contractor: Worker uses their own methods and expertise."],
    ["Evaluation", "Employee: Evaluated on how work is done. | Contractor: Evaluated on end results only."],
  ];
  for (const [factor, desc] of behavioral) {
    checkPage(doc, 50);
    doc.fillColor(NAVY).font("Helvetica-Bold").fontSize(10).text(factor);
    doc.fillColor(DARK_TEXT).font("Helvetica").fontSize(9).text(desc, { lineGap: 2 });
    doc.moveDown(0.4);
  }
  doc.moveDown(0.3);

  addSectionTitle(doc, "Financial Control");
  addParagraph(doc, "Does the company control the business and financial aspects of the worker's job?");
  const financial = [
    ["Investment", "Employee: Company provides tools and equipment. | Contractor: Worker invests in their own tools."],
    ["Expenses", "Employee: Company reimburses expenses. | Contractor: Worker bears unreimbursed expenses."],
    ["Profit/Loss", "Employee: Guaranteed regular wage. | Contractor: Can realize profit or loss."],
    ["Market Availability", "Employee: Works exclusively for one company. | Contractor: Offers services to the open market."],
  ];
  for (const [factor, desc] of financial) {
    checkPage(doc, 50);
    doc.fillColor(NAVY).font("Helvetica-Bold").fontSize(10).text(factor);
    doc.fillColor(DARK_TEXT).font("Helvetica").fontSize(9).text(desc, { lineGap: 2 });
    doc.moveDown(0.4);
  }
  doc.moveDown(0.3);

  checkPage(doc, 200);

  addSectionTitle(doc, "Relationship Type");
  addParagraph(doc, "How do the worker and company perceive their relationship?");
  const relationship = [
    ["Written Contract", "Does the contract describe the relationship? (Note: contract alone doesn't determine status)"],
    ["Benefits", "Employee: Receives benefits (health, retirement, PTO). | Contractor: No benefits provided."],
    ["Permanency", "Employee: Ongoing, indefinite relationship. | Contractor: Defined project or time period."],
    ["Key Activity", "Employee: Performs work central to the business. | Contractor: Provides specialized, supplemental services."],
  ];
  for (const [factor, desc] of relationship) {
    doc.fillColor(NAVY).font("Helvetica-Bold").fontSize(10).text(factor);
    doc.fillColor(DARK_TEXT).font("Helvetica").fontSize(9).text(desc, { lineGap: 2 });
    doc.moveDown(0.4);
  }
  doc.moveDown(0.3);

  checkPage(doc, 120);

  addSectionTitle(doc, "Quick Assessment Checklist");
  addChecklistItem(doc, "Worker sets their own schedule → Leans Contractor");
  addChecklistItem(doc, "Worker uses their own equipment → Leans Contractor");
  addChecklistItem(doc, "Worker serves multiple clients → Leans Contractor");
  addChecklistItem(doc, "Company controls how work is performed → Leans Employee");
  addChecklistItem(doc, "Worker receives benefits → Leans Employee");
  addChecklistItem(doc, "Relationship is ongoing without defined end → Leans Employee");
  doc.moveDown(0.3);
  addParagraph(doc, "Important: No single factor determines classification. The IRS looks at the total relationship. When in doubt, consult a tax professional or file IRS Form SS-8 for a determination.");

  addCTA(doc);
  addFooter(doc);
  return saveDoc(doc, "contractor-vs-employee-matrix.pdf");
}

function generateCashFlowForecast() {
  const doc = createDoc();
  addHeader(doc, "Cash Flow Forecast Template", "12-Month Rolling Cash Flow Tracker");

  addParagraph(doc, "Cash flow forecasting helps you anticipate shortfalls, plan investments, and demonstrate financial control to lenders. Complete this template monthly and compare actuals to projections for continuous improvement.");
  doc.moveDown(0.5);

  addSectionTitle(doc, "Monthly Cash Flow Worksheet");
  addParagraph(doc, "Complete one row per month. Update projected vs. actual as each month closes.");
  doc.moveDown(0.3);

  for (let i = 1; i <= 12; i++) {
    checkPage(doc, 100);
    addSubsection(doc, `Month ${i}: _______________`);
    addChecklistItem(doc, "Beginning Cash Balance: $________");
    addChecklistItem(doc, "Cash Inflows: Sales Revenue $________ | Other Income $________ | Total In $________");
    addChecklistItem(doc, "Cash Outflows: Payroll $_____ | Rent $_____ | Supplies $_____ | Marketing $_____ | Loan Pmts $_____ | Other $_____ | Total Out $________");
    addChecklistItem(doc, "Net Cash Flow (Inflows - Outflows): $________");
    addChecklistItem(doc, "Ending Cash Balance: $________");
    doc.moveDown(0.3);
  }

  checkPage(doc, 180);

  addSectionTitle(doc, "Seasonal Adjustment Notes");
  addChecklistItem(doc, "Identify your highest-revenue months: _______________");
  addChecklistItem(doc, "Identify your lowest-revenue months: _______________");
  addChecklistItem(doc, "Large annual expenses (insurance, taxes, licenses) — month and amount: _______________");
  addChecklistItem(doc, "Planned capital expenditures — month and amount: _______________");
  addChecklistItem(doc, "Cash reserve target (recommended 3–6 months operating expenses): $________");

  addCTA(doc);
  addFooter(doc);
  return saveDoc(doc, "cash-flow-forecast.pdf");
}

function generateClientOnboardingChecklist() {
  const doc = createDoc();
  addHeader(doc, "Client Onboarding Document Checklist", "What to Collect from New Bookkeeping Clients");

  addParagraph(doc, "Whether you're a bookkeeper onboarding new clients or a business owner preparing to work with a bookkeeping professional, this checklist ensures nothing falls through the cracks during setup.");
  doc.moveDown(0.5);

  const sections = [
    { title: "Business Information", items: [
      "Legal business name and DBA (if any)",
      "Business entity type (LLC, Corp, Sole Prop, Partnership)",
      "EIN (Employer Identification Number)",
      "State of formation and date of incorporation",
      "Business address and mailing address",
      "Primary contact name, email, and phone",
      "Industry / NAICS code",
      "Fiscal year end date",
    ]},
    { title: "Financial Access", items: [
      "QuickBooks Online (or other software) login credentials or invite",
      "Bank account access — read-only viewer or statement delivery setup",
      "Credit card account access or statement delivery",
      "PayPal / Stripe / Square / other payment processor access",
      "Payroll provider login (Gusto, ADP, Paychex, etc.)",
      "POS system access (if retail/restaurant)",
    ]},
    { title: "Historical Records", items: [
      "Last 12 months of bank statements (all accounts)",
      "Last 12 months of credit card statements",
      "Prior year tax returns (personal if Sole Prop/Partnership, business)",
      "Prior year financial statements (P&L, Balance Sheet)",
      "Existing chart of accounts",
      "Outstanding invoices (Accounts Receivable)",
      "Outstanding bills (Accounts Payable)",
    ]},
    { title: "Payroll Information (if applicable)", items: [
      "Number of employees (W-2) and contractors (1099)",
      "Payroll schedule (weekly, bi-weekly, semi-monthly, monthly)",
      "Current payroll tax deposit schedule",
      "State unemployment rate and account number",
      "Workers' compensation policy details",
    ]},
    { title: "Compliance & Tax", items: [
      "Sales tax permit number (if applicable)",
      "State tax registration details",
      "Any outstanding tax liabilities or payment plans",
      "Contact information for CPA or tax preparer",
      "Any pending audits or IRS correspondence",
    ]},
    { title: "Service Agreement", items: [
      "Signed engagement letter or service agreement",
      "Scope of services documented and agreed upon",
      "Monthly fee and billing terms confirmed",
      "Preferred communication method and response time expectations",
      "Document sharing method agreed upon (Google Drive, Dropbox, portal)",
    ]},
  ];

  for (const section of sections) {
    checkPage(doc, 50 + section.items.length * 18);
    addSectionTitle(doc, section.title);
    for (const item of section.items) addChecklistItem(doc, item);
    doc.moveDown(0.4);
  }

  addCTA(doc);
  addFooter(doc);
  return saveDoc(doc, "client-onboarding-checklist.pdf");
}

async function main() {
  console.log("Generating branded PDF templates...\n");
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  await generateFinancialReadinessChecklist();
  await generateMonthlyCloseChecklist();
  await generateChartOfAccounts();
  await generateExpenseCategorizationGuide();
  await generateSBALoanPrepChecklist();
  await generateFinancialProjectionWorksheet();
  await generateBusinessPlanOutline();
  await generateCryptoTransactionLog();
  await generateDigitalAssetTaxOrganizer();
  await generateEntitySetupChecklist();
  await generateContractorVsEmployee();
  await generateCashFlowForecast();
  await generateClientOnboardingChecklist();

  console.log(`\nDone! Generated 12 templates + 1 updated checklist in ${OUTPUT_DIR}`);
}

main().catch(console.error);
