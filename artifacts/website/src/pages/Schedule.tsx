import { usePageTitle } from "@/hooks/use-page-title";
import { Link } from "wouter";
import { Clock, Video, Phone, FileText, CheckCircle2, Calendar, ArrowRight } from "lucide-react";
import { useState } from "react";

const CALENDLY_URL = "https://calendly.com/tea-blueprintsandbookkeeping/30min";

const meetingTypes = [
  {
    icon: <Video className="w-5 h-5" />,
    title: "Video Call",
    duration: "30 min",
    description: "Face-to-face over Google Meet or Zoom. Best for new clients who want to discuss their situation in depth.",
    slug: "video-call",
  },
  {
    icon: <Phone className="w-5 h-5" />,
    title: "Phone Call",
    duration: "30 min",
    description: "Quick and focused. Ideal for follow-ups, pricing questions, or clients on the go.",
    slug: "phone-call",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Not Sure?",
    duration: "Pick what fits",
    description: "Upload your documents through the client portal or leave your info on the contact page and Tea will reach out within one business day.",
    slug: "async",
  },
];

function CalendlyEmbed() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative" style={{ minHeight: "700px" }}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Loading calendar...</p>
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
  usePageTitle("Schedule an Appointment");

  return (
    <div className="pt-24 pb-20">
      <section className="py-16 mb-10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Schedule an Appointment</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Pick the format that works for you — video, phone, or async document review. All slots show real-time availability.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {meetingTypes.map((mt) => (
            <div key={mt.slug} className="glass-card-hover rounded-2xl p-6 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                  {mt.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white text-[15px]">{mt.title}</h3>
                  <span className="text-xs text-muted-foreground font-mono">{mt.duration}</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {mt.description}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
          <div className="space-y-5">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-[15px]">Free & No Pressure</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Every first meeting is complimentary. No sales pitch — just an honest conversation about what you need.
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
                Prefer to share details first?{" "}
                <Link href="/contact" className="text-accent hover:underline">
                  Fill out the intake form
                </Link>{" "}
                and we'll review before your call.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="glass-card rounded-2xl overflow-hidden" style={{ minHeight: "700px" }}>
              <CalendlyEmbed />
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Don't see times that work?{" "}
              <Link href="/contact" className="text-accent hover:underline">Contact us directly</Link>{" "}
              and we'll find something.
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-10 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-3">Not ready to book yet?</h3>
          <p className="text-muted-foreground mb-6">Send us a message or fill out the discovery intake form and we'll reach out within one business day.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-white font-semibold text-sm hover:shadow-xl hover:shadow-accent/20 transition-all duration-300"
          >
            Go to Contact Page <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
