import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileDown,
  Lock,
  Unlock,
  CheckCircle,
  Loader2,
  ArrowRight,
  BookOpen,
  Calculator,
  Bitcoin,
  Briefcase,
  X,
  Library,
  Search,
} from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import { useNewsletterMutation } from "@/hooks/use-newsletter";

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  pageCount: number;
  filename: string;
}

const CATEGORIES = [
  { key: "all", label: "All Templates", icon: Library },
  { key: "bookkeeping", label: "Bookkeeping & Financial Organization", icon: BookOpen },
  { key: "planning", label: "Business Planning & Funding", icon: Calculator },
  { key: "crypto", label: "Crypto & Digital Assets", icon: Bitcoin },
  { key: "operations", label: "Operations & Growth", icon: Briefcase },
];

const TEMPLATES: Template[] = [
  {
    id: "financial-readiness",
    title: "Financial Readiness Checklist",
    description: "The same checklist our team applies when onboarding new founder clients — covering revenue tracking, key financial ratios, common red flags, and lender-readiness timelines.",
    category: "bookkeeping",
    pageCount: 2,
    filename: "financial-readiness-checklist.pdf",
  },
  {
    id: "monthly-close",
    title: "Monthly Close Checklist",
    description: "Step-by-step procedure for closing your books each month — from transaction review and reconciliation through adjustments, accruals, and final reporting.",
    category: "bookkeeping",
    pageCount: 2,
    filename: "monthly-close-checklist.pdf",
  },
  {
    id: "chart-of-accounts",
    title: "Chart of Accounts Template",
    description: "Industry-specific starter chart of accounts for small businesses, organized by Assets, Liabilities, Equity, Revenue, COGS, and Operating Expenses with standard account numbers.",
    category: "bookkeeping",
    pageCount: 2,
    filename: "chart-of-accounts-template.pdf",
  },
  {
    id: "expense-categorization",
    title: "Expense Categorization Guide",
    description: "Quick-reference guide for correctly categorizing common business expenses with IRS Schedule C line mappings for accurate tax reporting.",
    category: "bookkeeping",
    pageCount: 2,
    filename: "expense-categorization-guide.pdf",
  },
  {
    id: "sba-loan-prep",
    title: "SBA Loan Application Prep Checklist",
    description: "Every document and data point you need before applying for an SBA loan — organized by personal, business, financial projections, and collateral documentation.",
    category: "planning",
    pageCount: 2,
    filename: "sba-loan-prep-checklist.pdf",
  },
  {
    id: "financial-projection",
    title: "3-Year Financial Projection Worksheet",
    description: "Fillable framework for revenue forecasting, expense planning, and cash flow modeling with spaces for assumptions documentation and monthly breakdowns.",
    category: "planning",
    pageCount: 3,
    filename: "financial-projection-worksheet.pdf",
  },
  {
    id: "business-plan",
    title: "Business Plan Outline Template",
    description: "Section-by-section outline matching SBA and lender expectations — with writing prompts for executive summary, market analysis, financials, and more.",
    category: "planning",
    pageCount: 2,
    filename: "business-plan-outline.pdf",
  },
  {
    id: "crypto-transaction-log",
    title: "Crypto Transaction Log Template",
    description: "Structured log for tracking wallet transfers, exchange trades, staking rewards, and DeFi activity with all fields needed for accurate tax reporting.",
    category: "crypto",
    pageCount: 2,
    filename: "crypto-transaction-log.pdf",
  },
  {
    id: "digital-asset-tax",
    title: "Digital Asset Tax Prep Organizer",
    description: "Complete checklist of everything your tax preparer needs if you hold or transact in crypto — covering transaction records, income types, cost basis, and compliance forms.",
    category: "crypto",
    pageCount: 2,
    filename: "digital-asset-tax-organizer.pdf",
  },
  {
    id: "entity-setup",
    title: "New Business Entity Setup Checklist",
    description: "Step-by-step guide for forming an LLC or Corporation — Oregon-focused with nationwide notes covering naming, filing, EIN, tax setup, and ongoing compliance.",
    category: "operations",
    pageCount: 2,
    filename: "entity-setup-checklist.pdf",
  },
  {
    id: "contractor-employee",
    title: "Contractor vs Employee Decision Matrix",
    description: "Framework for determining worker classification using key IRS factors — behavioral control, financial control, and relationship type with a quick assessment checklist.",
    category: "operations",
    pageCount: 2,
    filename: "contractor-vs-employee-matrix.pdf",
  },
  {
    id: "cash-flow-forecast",
    title: "Cash Flow Forecast Template",
    description: "12-month rolling cash flow tracker with spaces for monthly inflows, outflows, net cash flow, and seasonal adjustment guidance.",
    category: "operations",
    pageCount: 3,
    filename: "cash-flow-forecast.pdf",
  },
  {
    id: "client-onboarding",
    title: "Client Onboarding Document Checklist",
    description: "What to collect from new bookkeeping clients — covering business info, financial access, historical records, payroll, compliance, and service agreements.",
    category: "operations",
    pageCount: 2,
    filename: "client-onboarding-checklist.pdf",
  },
];

const SESSION_KEY = "bb_resources_unlocked";

function getUnlocked(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

function setUnlocked() {
  try {
    sessionStorage.setItem(SESSION_KEY, "true");
  } catch {}
}

export default function Resources() {
  usePageTitle("Free Templates & Resources");
  const [unlocked, setUnlockedState] = useState(getUnlocked);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { subscribe, isPending } = useNewsletterMutation();

  const handleDownload = (filename: string) => {
    if (unlocked) {
      const link = document.createElement("a");
      link.href = `${import.meta.env.BASE_URL}downloads/${filename}`;
      link.download = filename;
      link.click();
    } else {
      setPendingDownload(filename);
      setShowModal(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const success = await subscribe({ email: email.trim(), signupSource: "lead_magnet" });
    if (success) {
      setUnlocked();
      setUnlockedState(true);
      setShowModal(false);
      setEmail("");
      if (pendingDownload) {
        setTimeout(() => {
          const link = document.createElement("a");
          link.href = `${import.meta.env.BASE_URL}downloads/${pendingDownload}`;
          link.download = pendingDownload;
          link.click();
          setPendingDownload(null);
        }, 500);
      }
    }
  };

  const filteredTemplates = TEMPLATES.filter((t) => {
    const matchesCategory = activeCategory === "all" || t.category === activeCategory;
    const matchesSearch = searchQuery === "" || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    const cat = CATEGORIES.find((c) => c.key === category);
    return cat ? cat.icon : BookOpen;
  };

  const getCategoryLabel = (category: string) => {
    const cat = CATEGORIES.find((c) => c.key === category);
    return cat ? cat.label : category;
  };

  return (
    <div>
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm mb-8 w-fit mx-auto">
            <span className="glow-dot" />
            <span className="text-sm font-medium text-accent">Free Downloads — No Strings Attached</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight mb-6 leading-[1.05]">
            Templates & <span className="text-gradient">Resources</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Professionally designed checklists, worksheets, and guides to help you organize your finances, prepare for funding, and grow your business.
          </motion.p>
        </div>
      </section>

      <section className="pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat.key
                      ? "bg-accent text-white"
                      : "bg-white/[0.04] text-muted-foreground hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors text-sm"
              />
            </div>
          </div>

          {unlocked && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-6 px-4 py-2.5 rounded-lg bg-green-500/10 border border-green-500/20 w-fit">
              <Unlock size={16} className="text-green-400" />
              <span className="text-sm text-green-400 font-medium">All templates unlocked — download freely!</span>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, i) => {
              const Icon = getCategoryIcon(template.category);
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative"
                >
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-tr from-accent/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                  <div className="relative glass-card rounded-2xl p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                        <Icon size={20} />
                      </div>
                      <span className="text-xs text-muted-foreground bg-white/[0.04] px-2.5 py-1 rounded-full">
                        {template.pageCount} {template.pageCount === 1 ? "page" : "pages"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors">
                      {template.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-1 leading-relaxed flex-grow">
                      {template.description}
                    </p>

                    <div className="text-xs text-accent/70 mb-4">
                      {getCategoryLabel(template.category)}
                    </div>

                    <button
                      onClick={() => handleDownload(template.filename)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                        unlocked
                          ? "bg-accent/15 border border-accent/30 text-accent hover:bg-accent hover:text-white hover:border-accent"
                          : "bg-white/[0.04] border border-white/10 text-muted-foreground hover:bg-accent/15 hover:border-accent/30 hover:text-accent"
                      }`}
                    >
                      {unlocked ? (
                        <>
                          <FileDown size={16} />
                          Download PDF
                        </>
                      ) : (
                        <>
                          <Lock size={16} />
                          Unlock to Download
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No templates found matching your search.</p>
              <button onClick={() => { setSearchQuery(""); setActiveCategory("all"); }} className="mt-4 text-accent hover:underline text-sm">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md"
            >
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-accent/20 via-transparent to-primary/20 blur-sm" />
              <div className="relative glass-card rounded-2xl p-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                    <FileDown size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Unlock All Templates</h3>
                    <p className="text-muted-foreground text-sm">Enter your email to access every template.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    autoFocus
                    className="w-full px-4 py-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full px-6 py-3.5 bg-accent text-white font-semibold rounded-lg shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Unlocking...
                      </>
                    ) : (
                      <>
                        <Unlock size={18} />
                        Unlock All Templates
                      </>
                    )}
                  </button>
                </form>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  We respect your privacy. Unsubscribe anytime.
                </p>

                <div className="mt-6 pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={14} className="text-green-400" />
                    <span className="text-xs text-muted-foreground">Instant access to all {TEMPLATES.length} templates</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={14} className="text-green-400" />
                    <span className="text-xs text-muted-foreground">Professionally designed with brand formatting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400" />
                    <span className="text-xs text-muted-foreground">No spam — just valuable founder resources</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="py-20 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
            Need Personalized Help?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            These templates are a great starting point, but every business is unique. If you need expert bookkeeping, a lender-ready business plan, or help organizing your finances, we're here to help.
          </p>
          <a
            href="/schedule"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-xl shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            Book a Free Discovery Call
            <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}
