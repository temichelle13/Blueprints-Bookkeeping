import { usePageTitle } from "@/hooks/use-page-title";
import { Link } from "wouter";
import { Clock, CheckCircle2, Calendar } from "lucide-react";

export default function Schedule() {
  usePageTitle("Book a Discovery Call");

  return (
    <div className="pt-24 pb-20">
      <section className="py-16 mb-10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Book a Discovery Call</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A free 30-minute call to understand your situation, answer your questions, and figure out if we're the right fit — no pressure, no sales pitch.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="space-y-5">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-[15px]">30 Minutes, Free</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                No commitment. Just a conversation to understand what you need and whether we're the right match.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-[15px]">What We'll Cover</h3>
              </div>
              <ul className="space-y-2">
                {[
                  "Your current bookkeeping situation",
                  "Business plan goals and timeline",
                  "Which service fits your needs",
                  "Pricing and next steps",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-accent/60 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Prefer to reach out first?{" "}
                <Link href="/contact" className="text-accent hover:underline">
                  Send us a message
                </Link>{" "}
                and we'll be in touch within one business day.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl overflow-hidden" style={{ minHeight: "600px" }}>
              <div className="w-full h-full min-h-[600px]">
                <iframe
                  src="https://calendly.com/tea-blueprintsandbookkeeping/30min"
                  width="100%"
                  height="650"
                  frameBorder="0"
                  title="Schedule a discovery call"
                  className="w-full"
                  style={{ background: "transparent" }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Don't see times that work?{" "}
              <Link href="/contact" className="text-accent hover:underline">Contact us directly</Link>{" "}
              and we'll find something.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
