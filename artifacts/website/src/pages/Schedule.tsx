import { useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";

const CALENDLY_URL = "https://calendly.com/tea-blueprintsandbookkeeping/30min";

function CalendlyEmbed() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative" style={{ minHeight: "700px" }}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Loading calendar…</p>
          </div>
        </div>
      )}
      <iframe
        src={`${CALENDLY_URL}?embed_type=Inline&hide_gdpr_banner=1&background_color=161b2e&text_color=d8dce4&primary_color=6366f1`}
        width="100%"
        height="700"
        frameBorder="0"
        title="Schedule a discovery call with Tea"
        onLoad={() => setLoaded(true)}
        style={{ borderRadius: 12, display: "block" }}
      />
    </div>
  );
}

export default function Schedule() {
  usePageTitle("Book a Discovery Call");

  return (
    <div className="pt-24 pb-20">
      <SEO description="Book a free 30-minute discovery call with Tea at Blueprints & Bookkeeping. No commitment — just an honest conversation about your bookkeeping or business plan needs." />

      <section className="py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Book a Free Discovery Call
          </h1>
          <p className="text-lg text-muted-foreground">
            30 minutes, no commitment. Pick a time that works for you.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-2xl overflow-hidden">
          <CalendlyEmbed />
        </div>
      </div>
    </div>
  );
}
