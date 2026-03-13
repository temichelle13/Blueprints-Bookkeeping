import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Globe, Calculator, ShieldCheck, Clock, Users, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center pt-32 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm mb-8"
          >
            <span className="glow-dot" />
            <span className="text-sm font-medium text-accent">Roseburg, OR &mdash; Serving Nationwide</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight max-w-4xl mb-6 leading-[1.05]"
          >
            Your Blueprint to{" "}
            <span className="text-gradient">Business Success</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
          >
            We transform financial complexity into scalable growth through advanced bookkeeping, lender-ready business plans, and modern digital presence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/contact"
              className="group px-8 py-4 rounded-xl bg-accent text-white font-semibold text-lg shadow-xl shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Schedule Discovery Call
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/services"
              className="px-8 py-4 rounded-xl bg-white/[0.04] text-white backdrop-blur-sm border border-white/10 font-semibold text-lg hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 flex items-center justify-center"
            >
              Explore Our Services
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </section>

      <section className="py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="accent-bar mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Three Pillars of Growth</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">Financial infrastructure designed for founders who have outgrown generalist solutions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Calculator className="w-6 h-6" />,
                title: "Advanced Bookkeeping",
                description: "Multi-entity structuring, historical cleanups, and rule-based QBO automation for operations that demand precision.",
                tag: "ONGOING"
              },
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: "Lender-Ready Plans",
                description: "3-to-5-year financial forecasting built to survive bank underwriting and institutional due diligence.",
                tag: "PROJECT"
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: "The Digital Handshake",
                description: "Ditch the PDF. Your business plan delivered as a custom, high-performance static website.",
                tag: "INNOVATION"
              }
            ].map((pillar, i) => (
              <div key={i} className="glass-card-hover rounded-2xl p-8 group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                    {pillar.icon}
                  </div>
                  <span className="text-[11px] font-mono font-medium tracking-widest text-muted-foreground">{pillar.tag}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{pillar.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-[15px]">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="glow-line max-w-5xl mx-auto" />

      <section className="py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="accent-bar mb-6" />
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                Why High-Value Founders Choose Us
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Generalist bookkeepers hit a complexity ceiling. Tax practices disappear during Q1. We designed a boutique model that stays available and technically unmatched.
              </p>

              <div className="space-y-6">
                {[
                  { icon: <Clock className="w-5 h-5" />, title: "12-Month Availability", desc: "No tax preparation means no seasonal blind spots. We are a year-round strategic resource." },
                  { icon: <ShieldCheck className="w-5 h-5" />, title: "No Offshore — Ever", desc: "100% domestic. Your sensitive financial data is handled personally by a dedicated US expert." },
                  { icon: <Users className="w-5 h-5" />, title: "20-Client Maximum", desc: "Strictly capped roster to ensure executive-level dedication and rapid response times." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="mt-0.5 p-2.5 rounded-lg bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-[15px] mb-1">{item.title}</h4>
                      <p className="text-muted-foreground text-[15px] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-accent/20 via-transparent to-primary/20 blur-sm" />
              <div className="relative glass-card rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span className="text-sm font-semibold text-white">The Blueprints Difference</span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Fortune 500 Financial Expertise", value: true },
                    { label: "Certified Ethical Hacker (CEH v12)", value: true },
                    { label: "QuickBooks ProAdvisor Advanced", value: true },
                    { label: "Year-Round Availability", value: true },
                    { label: "Offshore Labor", value: false },
                    { label: "Tax Season Blackouts", value: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${item.value ? 'bg-green-500/20 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                        {item.value ? '✓' : '✕'}
                      </div>
                      <span className={`text-[14px] ${item.value ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-accent/[0.02] to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
            Stop Guessing.<br />
            <span className="text-gradient">Start Scaling.</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Secure your financial infrastructure and map out a profitable future today.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-bold text-lg rounded-xl shadow-xl shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            Book Your Consultation
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
