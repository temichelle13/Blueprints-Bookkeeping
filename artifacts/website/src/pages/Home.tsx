import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Globe, Calculator, ShieldCheck, Clock, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="pt-20">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Abstract dark blue background" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/80 to-background"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mt-12">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent-foreground font-medium text-sm mb-6 backdrop-blur-sm shadow-[0_0_15px_rgba(91,94,166,0.5)]"
          >
            Based in Roseburg, OR • Serving Nationwide
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight max-w-4xl mb-6 leading-tight"
          >
            Your Blueprint to <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-accent">Business Success</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mb-10 leading-relaxed"
          >
            We transform financial complexity into scalable growth through advanced bookkeeping, lender-ready business plans, and modern digital presence.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          >
            <Link 
              href="/contact" 
              className="px-8 py-4 rounded-xl bg-accent text-white font-semibold text-lg hover:bg-accent/90 shadow-xl shadow-accent/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Schedule Discovery Call <ArrowRight size={20} />
            </Link>
            <Link 
              href="/services" 
              className="px-8 py-4 rounded-xl bg-white/10 text-white backdrop-blur-md border border-white/20 font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
            >
              Explore Our Services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* THREE PILLARS SECTION */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">Our Core Pillars</h2>
            <p className="text-muted-foreground text-lg">Comprehensive financial infrastructure designed to elevate your business operations and secure funding.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Calculator className="w-12 h-12 text-accent mb-6" />,
                title: "Advanced Bookkeeping",
                description: "Overcome the complexity ceiling with multi-entity structuring, historical data cleanups, and rule-based QBO automation."
              },
              {
                icon: <BookOpen className="w-12 h-12 text-accent mb-6" />,
                title: "Lender-Ready Business Plans",
                description: "Rigorous 3-to-5-year financial forecasting tailored to withstand the scrutiny of bank underwriting and institutional investors."
              },
              {
                icon: <Globe className="w-12 h-12 text-accent mb-6" />,
                title: "The Digital Handshake",
                description: "Ditch the PDF. We deliver your strategic business plan as a custom, professional static website for a modern competitive edge."
              }
            ].map((pillar, i) => (
              <div key={i} className="premium-shadow bg-card rounded-2xl p-8 border border-border group hover:border-accent/30">
                <div className="transform group-hover:scale-110 group-hover:text-accent transition-transform duration-300 origin-left">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{pillar.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SIGNALS SECTION */}
      <section className="py-24 bg-muted relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">Why High-Value Founders Choose Us</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Generalist bookkeepers hit a complexity ceiling. Tax practices disappear during Q1. We designed a boutique model that remains consistently available and technically unmatched.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: <Clock className="w-6 h-6 text-accent" />, title: "12-Month Availability", desc: "No tax preparation means no seasonal blind spots. We are a year-round strategic resource." },
                  { icon: <ShieldCheck className="w-6 h-6 text-accent" />, title: "No Offshore Guarantee", desc: "100% domestic. Your sensitive financial data is handled personally by a dedicated US expert." },
                  { icon: <Users className="w-6 h-6 text-accent" />, title: "Strictly Capped Roster", desc: "Limited to 20 active clients to ensure executive-level dedication and rapid response times." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="mt-1 p-2 bg-white rounded-lg shadow-sm border border-border">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              {/* Decorative elements behind image */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-accent/20 to-primary/10 rounded-3xl transform rotate-3" />
              <img 
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000" 
                alt="Financial planning documents and analytics" 
                className="relative rounded-2xl shadow-2xl border border-border w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-primary text-white text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Stop Guessing. Start Scaling.</h2>
          <p className="text-xl text-primary-foreground/80 mb-10">
            Secure your financial infrastructure and map out a profitable future today.
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold text-lg rounded-xl shadow-xl hover:bg-accent hover:text-white transition-all duration-300 hover:-translate-y-1"
          >
            Book Your Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
