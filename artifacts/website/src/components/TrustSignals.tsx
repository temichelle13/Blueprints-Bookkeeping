import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";
import {
  Star,
  ExternalLink,
  Shield,
  ShieldCheck,
  Award,
  MapPin,
  Users,
  TrendingUp,
  FileCheck,
  Newspaper,
} from "lucide-react";

function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));

  useEffect(() => {
    if (inView) {
      animate(motionVal, value, { duration: 2, ease: "easeOut" });
    }
  }, [inView, value, motionVal]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${v.toLocaleString()}${suffix}`;
      }
    });
    return unsubscribe;
  }, [rounded, suffix, prefix]);

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

export function StatsProofBar() {
  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      value: 20,
      suffix: "",
      label: "Client Maximum",
      description: "Small roster, full attention",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      value: 365,
      suffix: "",
      label: "Days a Year",
      description: "No seasonal blackouts",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      value: 3,
      suffix: "",
      label: "Core Services",
      description: "Books · Plans · Notary",
    },
    {
      icon: <Award className="w-6 h-6" />,
      value: 4,
      suffix: "",
      label: "Pro Certifications",
      description: "CEH v12 · QB ProAdvisor",
    },
  ];

  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 text-center group hover:border-accent/20 transition-all"
            >
              <div className="inline-flex p-3 rounded-xl bg-accent/10 text-accent mb-4 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-display font-extrabold text-white mb-1">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix || ""}
                />
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const credentials = [
  {
    name: "QuickBooks ProAdvisor",
    shortName: "QB ProAdvisor",
    icon: <FileCheck className="w-7 h-7" />,
  },
  {
    name: "Certified Ethical Hacker v12",
    shortName: "CEH v12",
    icon: <Shield className="w-7 h-7" />,
  },
  {
    name: "Oregon Secretary of State LLC",
    shortName: "OR SOS Verified",
    icon: <MapPin className="w-7 h-7" />,
    link: "https://sos.oregon.gov/business/pages/find.aspx",
    linkLabel: "Verify on OR SOS",
  },
  {
    name: "No Offshore Processing",
    shortName: "100% US-Based",
    icon: <ShieldCheck className="w-7 h-7" />,
  },
];

export function CredentialBadgeStrip({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? "py-10" : "py-16 relative"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!compact && (
          <div className="flex flex-col items-center text-center mb-10">
            <div className="accent-bar mb-6" />
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
              Professional Credentials
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg">
              Verified certifications and trust seals backing every engagement.
            </p>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {credentials.map((cred, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card-hover flex flex-col items-center text-center p-5 rounded-xl hover:border-accent/20 transition-all duration-300"
            >
              <div className="p-2.5 rounded-lg bg-accent/10 text-accent mb-3">{cred.icon}</div>
              <span className="text-xs font-semibold text-white mb-1 leading-tight">
                {compact ? cred.shortName : cred.name}
              </span>
              {cred.link && (
                <a
                  href={cred.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-accent hover:text-white flex items-center gap-1 mt-1 transition-colors"
                >
                  {cred.linkLabel} <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GoogleReviewsCallout() {
  return (
    <section className="py-16 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-8 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500" />

          <div className="flex items-center justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className="w-6 h-6 text-yellow-400 fill-yellow-400"
              />
            ))}
          </div>

          <p className="text-2xl font-display font-bold text-white mb-1">5.0 on Google</p>
          <p className="text-muted-foreground text-sm mb-6">
            See what clients are saying about working with Blueprints & Bookkeeping.
          </p>

          <a
            href="https://share.google/tFabL2u2cEZcsyGb7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white font-semibold text-sm hover:bg-white/[0.1] hover:border-white/20 transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Read Our Google Reviews
            <ExternalLink className="w-4 h-4 opacity-60" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export function FeaturedInPlaceholder() {
  const placeholders = [
    "TechCrunch",
    "Forbes",
    "Inc. Magazine",
    "Oregon Business Journal",
  ];

  return (
    <section className="py-12 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-8"
        >
          <p className="text-center text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground/50 mb-6 flex items-center justify-center gap-2">
            <Newspaper className="w-3.5 h-3.5" />
            Featured In / Trusted By
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-20">
            {placeholders.map((name, i) => (
              <span
                key={i}
                className="text-lg font-display font-bold text-muted-foreground tracking-wide"
              >
                {name}
              </span>
            ))}
          </div>
          {/*
            PLACEHOLDER: This "Featured In / Trusted By" row is intentionally
            dimmed. Replace the placeholder names above with real press mentions,
            partner logos, or trust badges once available. Remove the opacity-20
            class from the container div when real logos are added.
          */}
          <p className="text-center text-[10px] text-muted-foreground/30 mt-4 italic">
            Placeholder — update with real press mentions &amp; partner logos
          </p>
        </motion.div>
      </div>
    </section>
  );
}
