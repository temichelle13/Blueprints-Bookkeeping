import { motion } from "framer-motion";
import { FileDown, ArrowRight, BookOpen, Calculator, Bitcoin, Briefcase } from "lucide-react";
import { Link } from "wouter";

const RESOURCE_HIGHLIGHTS = [
  { icon: BookOpen, text: "Checklists for monthly close, expense categorization, and financial readiness" },
  { icon: Calculator, text: "Financial projections, business plan templates, and startup planning checklists" },
  { icon: Bitcoin, text: "Crypto transaction logs and digital asset tax organizers" },
  { icon: Briefcase, text: "Entity setup guides, contractor classification, and cash flow forecasting" },
];

export function LeadMagnetSection() {
  return (
    <section className="py-28 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="accent-bar mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Free Templates &{" "}
              <span className="text-gradient">Resources Library</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Download 13 professionally designed checklists, worksheets, and guides — the same tools
              our team uses with clients. Covering bookkeeping, business planning, crypto, and operations.
            </p>

            <ul className="space-y-3 mb-2">
              {RESOURCE_HIGHLIGHTS.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                    <item.icon size={11} className="text-accent" />
                  </div>
                  <span className="text-muted-foreground text-[15px]">{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-accent/20 via-transparent to-primary/20 blur-sm" />
              <div className="relative glass-card rounded-2xl p-8 text-center">
                <div className="p-4 rounded-xl bg-accent/10 text-accent w-fit mx-auto mb-6">
                  <FileDown size={36} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  13 Free Templates
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Professionally branded checklists, worksheets, and guides covering bookkeeping,
                  business planning, crypto accounting, and operations.
                </p>
                <Link
                  href="/resources"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-accent text-white font-semibold rounded-xl shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Browse All Templates
                  <ArrowRight size={18} />
                </Link>
                <p className="text-xs text-muted-foreground mt-4">
                  Free with email — unlock instant access to every template.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
