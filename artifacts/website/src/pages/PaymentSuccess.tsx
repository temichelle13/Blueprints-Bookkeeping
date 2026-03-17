import { Link } from "wouter";
import { CheckCircle, ArrowRight, Phone, Mail } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import { buildOnboardingUrl, getOnboardingContextFromSearch } from "@/lib/onboarding-url";

const SERVICE_LABELS: Record<string, string> = {
  essentials: "Essentials Bookkeeping",
  growth: "Growth Bookkeeping",
  startup_roadmap: "Startup Roadmap",
  sba_investor: "Full Plan Package",
};

export default function PaymentSuccess() {
  usePageTitle("Payment Confirmed");

  const { service, plan, sessionId } = getOnboardingContextFromSearch(window.location.search);
  const serviceLabel = SERVICE_LABELS[service || ""] || "your selected service";
  const onboardingHref = buildOnboardingUrl({ service, plan, sessionId });

  return (
    <div className="pt-24 pb-20">
      <SEO title="Payment Confirmed" noindex />
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card rounded-2xl p-10 md:p-14">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Payment Received!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for your deposit for <span className="text-foreground font-medium">{serviceLabel}</span>. We're excited to work with you.
            </p>

            <div className="bg-surface border border-white/[0.06] rounded-xl p-6 text-left mb-8">
              <h3 className="text-sm font-mono font-semibold tracking-widest text-accent uppercase mb-4">
                What Happens Next
              </h3>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">1</span>
                  <span className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Confirmation email</span> — Check your inbox for a receipt and next-steps details.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">2</span>
                  <span className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Kickoff call</span> — Tea will reach out within 1 business day to schedule your kickoff call.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">3</span>
                  <span className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Engagement documents</span> — You'll receive your Engagement Letter and NDA via Adobe Sign.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">4</span>
                  <span className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Onboarding</span> — Complete the intake form so we can hit the ground running.
                  </span>
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link
                href={onboardingHref}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-white font-semibold text-sm hover:shadow-xl hover:shadow-accent/20 transition-all duration-300"
              >
                Start Onboarding <ArrowRight size={15} />
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
              >
                Back to Home
              </Link>
            </div>

            <div className="border-t border-white/[0.06] pt-6">
              <p className="text-xs text-muted-foreground mb-3">Questions? We're here to help.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-muted-foreground">
                <a href="tel:+15413198654" className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Phone size={14} className="text-accent" /> (541) 319-8654
                </a>
                <a href="mailto:tea@blueprintsandbookkeeping.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Mail size={14} className="text-accent" /> tea@blueprintsandbookkeeping.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
