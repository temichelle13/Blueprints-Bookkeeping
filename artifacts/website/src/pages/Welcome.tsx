import { Link } from "wouter";
import { CheckCircle, ArrowRight, FileText, Upload } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";

export default function Welcome() {
  usePageTitle("Welcome — Blueprints & Bookkeeping");

  const params = new URLSearchParams(window.location.search);
  const plan = params.get("plan");
  const sessionId = params.get("session_id") || "";
  const name = params.get("name") || "";
  const email = params.get("email") || "";
  const planLabel = plan === "growth" ? "Growth" : plan === "essentials" ? "Essentials" : "your selected";

  const clientPortalHref = `/client-portal${name || email ? `?${new URLSearchParams({
    ...(name ? { name } : {}),
    ...(email ? { email } : {}),
  }).toString()}` : ""}`;

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <SEO title="Welcome" noindex />
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 mb-8">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Welcome Aboard!</h1>
          <p className="text-xl text-muted-foreground mb-2">
            Your <span className="text-accent font-semibold">{planLabel}</span> plan subscription is active.
          </p>
          <p className="text-muted-foreground">
            Payment confirmed. Let's get you set up.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-2xl p-8 md:p-10 mb-8">
          <h2 className="text-2xl font-display font-bold text-white mb-6">What Happens Next</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">1</div>
              <div>
                <h3 className="text-white font-semibold mb-1">Complete Your Onboarding Form</h3>
                <p className="text-muted-foreground text-sm">Tell us about your business so we can hit the ground running. This takes about 5 minutes.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">2</div>
              <div>
                <h3 className="text-white font-semibold mb-1">Sign Your Contracts</h3>
                <p className="text-muted-foreground text-sm">You'll receive an Engagement Letter and NDA via Adobe Sign. Review and e-sign at your convenience.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">3</div>
              <div>
                <h3 className="text-white font-semibold mb-1">Upload Your Documents</h3>
                <p className="text-muted-foreground text-sm">Securely share bank statements, prior financials, and access credentials through our document portal.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link
            href={`/onboarding?plan=${plan || ""}${sessionId ? `&session_id=${sessionId}` : ""}`}
            className="glass-card rounded-xl p-6 flex items-center gap-4 hover:border-accent/30 transition-all group"
          >
            <div className="p-3 bg-accent/10 rounded-lg text-accent">
              <FileText size={24} />
            </div>
            <div className="flex-grow">
              <h4 className="text-white font-semibold">Onboarding Form</h4>
              <p className="text-sm text-muted-foreground">Complete your intake</p>
            </div>
            <ArrowRight className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
          </Link>

          <Link
            href={clientPortalHref}
            className="glass-card rounded-xl p-6 flex items-center gap-4 hover:border-accent/30 transition-all group"
          >
            <div className="p-3 bg-accent/10 rounded-lg text-accent">
              <Upload size={24} />
            </div>
            <div className="flex-grow">
              <h4 className="text-white font-semibold">Document Portal</h4>
              <p className="text-sm text-muted-foreground">Upload securely</p>
            </div>
            <ArrowRight className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
          </Link>
        </div>

        <div className="glass-card rounded-xl p-6 text-center">
          <p className="text-muted-foreground text-sm">
            A confirmation email with these details has been sent to your inbox. Questions? Reach us at{" "}
            <a href="mailto:tea@blueprintsandbookkeeping.com" className="text-accent hover:underline">tea@blueprintsandbookkeeping.com</a>{" "}
            or <a href="tel:+15413198654" className="text-accent hover:underline">(541) 319-8654</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
