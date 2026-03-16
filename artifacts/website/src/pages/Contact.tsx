import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import { useContactMutation } from "@/hooks/use-contact";

const CALENDLY_URL = "https://calendly.com/tea-blueprintsandbookkeeping/30min";

const messageSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  message: z.string().min(10, "Please include a message (at least 10 characters)"),
  website: z.string().max(0).optional(),
});
type MessageValues = z.infer<typeof messageSchema>;

function CalendlyEmbed() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: "660px" }}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/60">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Loading calendar…</p>
          </div>
        </div>
      )}
      <iframe
        src={`${CALENDLY_URL}?embed_type=Inline&hide_gdpr_banner=1&background_color=161b2e&text_color=d8dce4&primary_color=6366f1`}
        width="100%"
        height="660"
        frameBorder="0"
        title="Book a discovery call with Tea"
        onLoad={() => setLoaded(true)}
        style={{ display: "block" }}
      />
    </div>
  );
}

function MessageForm() {
  const { submit: sendMessage, isPending } = useContactMutation();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MessageValues>({ resolver: zodResolver(messageSchema) });

  const onSubmit = async (data: MessageValues) => {
    const ok = await sendMessage({
      formType: "quick",
      name: data.name,
      email: data.email,
      message: data.message,
      website: data.website || "",
    });
    if (ok) {
      setSent(true);
      reset();
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
        <CheckCircle2 className="w-10 h-10 text-green-400" />
        <p className="text-white font-semibold text-lg">Message received!</p>
        <p className="text-muted-foreground text-sm">Tea will reply within one business day.</p>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 transition-colors text-sm";
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="text" {...register("website")} className="hidden" tabIndex={-1} autoComplete="off" />

      <div>
        <label className={labelClass}>Your Name</label>
        <input {...register("name")} placeholder="Jane Smith" className={inputClass} />
        {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Email Address</label>
        <input {...register("email")} type="email" placeholder="jane@company.com" className={inputClass} />
        {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Message</label>
        <textarea
          {...register("message")}
          rows={5}
          placeholder="Tell me a little about your business and what you need help with…"
          className={`${inputClass} resize-none`}
        />
        {errors.message && <p className="text-destructive text-xs mt-1">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:shadow-xl hover:shadow-accent/20 transition-all duration-300 disabled:opacity-50"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        {isPending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

export default function Contact() {
  usePageTitle("Contact");

  return (
    <div className="pt-24 pb-20">
      <SEO description="Get in touch with Blueprints & Bookkeeping. Book a free discovery call or send a message — Tea will respond within one business day." />

      <section className="py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            Book a free 30-minute call, or send a message and Tea will reply within one business day.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2">
            <p className="text-xs font-mono font-semibold uppercase tracking-widest text-accent mb-3">Book a Free Discovery Call</p>
            <div className="glass-card rounded-2xl overflow-hidden">
              <CalendlyEmbed />
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-7">
              <p className="text-xs font-mono font-semibold uppercase tracking-widest text-accent mb-5">Send a Message</p>
              <MessageForm />
            </div>

            <div className="glass-card rounded-2xl p-7 space-y-5">
              <p className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground mb-2">Direct Contact</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone size={16} className="text-accent shrink-0" />
                <a href="tel:+15413198654" className="hover:text-white transition-colors">(541) 319-8654</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail size={16} className="text-accent shrink-0" />
                <a href="mailto:tea@blueprintsandbookkeeping.com" className="hover:text-white transition-colors">tea@blueprintsandbookkeeping.com</a>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin size={16} className="text-accent shrink-0 mt-0.5" />
                <span>Roseburg, OR — serving clients nationwide</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
