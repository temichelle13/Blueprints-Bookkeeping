import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, MapPin, Send, Calendar } from "lucide-react";
import { Link } from "wouter";
import {
  useContactMutation,
  quickContactSchema,
  detailedContactSchema,
  type QuickContactValues,
  type DetailedContactValues
} from "@/hooks/use-contact";
import { usePageTitle } from "@/hooks/use-page-title";
import { GoogleReviewsCallout } from "@/components/TrustSignals";

export default function Contact() {
  usePageTitle("Contact Us");

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <section className="py-16 mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Let's Talk Strategy</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the path that fits your timeline. Book a call directly, send a quick note, or give us the details for a tailored discovery session.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="glass-card rounded-2xl p-8 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={22} className="text-accent" />
              <h2 className="text-2xl font-display font-bold text-white">Book a Time Directly</h2>
            </div>
            <p className="text-muted-foreground mb-6 text-[15px] max-w-2xl">
              Ready to get started or have a quick question? Skip the form and book a 30-minute discovery call directly on the calendar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/schedule"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-white font-semibold text-sm hover:shadow-xl hover:shadow-accent/20 transition-all duration-300"
              >
                <Calendar size={16} />
                View Calendar & Book
              </Link>
              <span className="text-muted-foreground text-sm self-center">
                Free discovery call &mdash; no commitment required
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-grow bg-white/[0.06]" />
          <span className="text-xs font-mono font-medium tracking-widest text-muted-foreground uppercase">Or send us a message</span>
          <div className="h-px flex-grow bg-white/[0.06]" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-1">Quick Message</h2>
              <p className="text-muted-foreground text-sm mb-6">Just have a question? Drop it here.</p>
              <QuickContactForm />
            </div>

            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Direct Channels</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-accent/10 rounded-lg text-accent" aria-hidden="true"><Mail size={18} /></div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-mono">Email</p>
                    <a href="mailto:tea@blueprintsandbookkeeping.com" className="font-medium text-foreground hover:text-accent transition-colors text-sm">tea@blueprintsandbookkeeping.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-accent/10 rounded-lg text-accent" aria-hidden="true"><Phone size={18} /></div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-mono">Phone</p>
                    <a href="tel:+15413198654" className="font-medium text-foreground hover:text-accent transition-colors text-sm">(541) 319-8654</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-accent/10 rounded-lg text-accent" aria-hidden="true"><MapPin size={18} /></div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-mono">Location</p>
                    <p className="font-medium text-foreground text-sm">Roseburg, Oregon (Remote US)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 glass-card rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl font-display font-bold text-white mb-2">Discovery Intake Form</h2>
            <p className="text-muted-foreground mb-8 text-[15px]">New to us? Provide context about your operations so we can hit the ground running on our first call.</p>
            <DetailedIntakeForm />
          </div>
        </div>
      </section>

      <GoogleReviewsCallout />
    </div>
  );
}

function QuickContactForm() {
  const { submit, isPending } = useContactMutation();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<QuickContactValues>({
    resolver: zodResolver(quickContactSchema),
    defaultValues: { formType: "quick" }
  });

  const onSubmit = async (data: QuickContactValues) => {
    await submit(data);
    reset();
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-surface border border-white/[0.06] text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:ring-2 focus:ring-accent/10 outline-none transition-all";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="absolute opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
        <label htmlFor="quick-website">Website</label>
        <input {...register("website")} id="quick-website" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <label htmlFor="quick-name" className="sr-only">Name</label>
        <input {...register("name")} id="quick-name" placeholder="Name" className={inputClass} aria-describedby={errors.name ? "quick-name-error" : undefined} />
        {errors.name && <span id="quick-name-error" role="alert" className="text-destructive text-xs mt-1 block">{errors.name.message}</span>}
      </div>
      <div>
        <label htmlFor="quick-email" className="sr-only">Email Address</label>
        <input {...register("email")} id="quick-email" placeholder="Email Address" type="email" className={inputClass} aria-describedby={errors.email ? "quick-email-error" : undefined} />
        {errors.email && <span id="quick-email-error" role="alert" className="text-destructive text-xs mt-1 block">{errors.email.message}</span>}
      </div>
      <div>
        <label htmlFor="quick-message" className="sr-only">Message</label>
        <textarea {...register("message")} id="quick-message" placeholder="How can we help?" rows={4} className={`${inputClass} resize-none`} aria-describedby={errors.message ? "quick-message-error" : undefined} />
        {errors.message && <span id="quick-message-error" role="alert" className="text-destructive text-xs mt-1 block">{errors.message.message}</span>}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-accent text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Send size={16} aria-hidden="true" />
        {isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

function DetailedIntakeForm() {
  const { submit, isPending } = useContactMutation();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DetailedContactValues>({
    resolver: zodResolver(detailedContactSchema),
    defaultValues: { formType: "detailed", servicesInterested: [] }
  });

  const onSubmit = async (data: DetailedContactValues) => {
    await submit(data);
    reset();
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-surface border border-white/[0.06] text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:ring-2 focus:ring-accent/10 outline-none transition-all";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="absolute opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
        <label htmlFor="detailed-website">Website</label>
        <input {...register("website")} id="detailed-website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="detail-name" className={labelClass}>Your Name *</label>
          <input {...register("name")} id="detail-name" className={inputClass} aria-describedby={errors.name ? "detail-name-error" : undefined} />
          {errors.name && <span id="detail-name-error" role="alert" className="text-destructive text-xs mt-1 block">{errors.name.message}</span>}
        </div>
        <div>
          <label htmlFor="detail-business" className={labelClass}>Business Name *</label>
          <input {...register("businessName")} id="detail-business" className={inputClass} aria-describedby={errors.businessName ? "detail-business-error" : undefined} />
          {errors.businessName && <span id="detail-business-error" role="alert" className="text-destructive text-xs mt-1 block">{errors.businessName.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="detail-email" className={labelClass}>Email Address *</label>
          <input {...register("email")} id="detail-email" type="email" className={inputClass} aria-describedby={errors.email ? "detail-email-error" : undefined} />
          {errors.email && <span id="detail-email-error" role="alert" className="text-destructive text-xs mt-1 block">{errors.email.message}</span>}
        </div>
        <div>
          <label htmlFor="detail-phone" className={labelClass}>Phone Number</label>
          <input {...register("phone")} id="detail-phone" type="tel" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="detail-industry" className={labelClass}>Industry *</label>
          <select {...register("industry")} id="detail-industry" className={inputClass} aria-describedby={errors.industry ? "detail-industry-error" : undefined}>
            <option value="">Select an industry...</option>
            <option value="Agriculture & Timber">Agriculture & Timber</option>
            <option value="Crypto/Digital Assets">Crypto / Digital Assets</option>
            <option value="E-commerce/Gig">E-commerce / Gig Economy</option>
            <option value="Tech/Startup">Tech / Startup</option>
            <option value="Real Estate/Multi-Entity">Real Estate / Holding</option>
            <option value="Other">Other</option>
          </select>
          {errors.industry && <span id="detail-industry-error" role="alert" className="text-destructive text-xs mt-1 block">{errors.industry.message}</span>}
        </div>
        <div>
          <label htmlFor="detail-revenue" className={labelClass}>Avg. Monthly Revenue</label>
          <select {...register("monthlyRevenueRange")} id="detail-revenue" className={inputClass}>
            <option value="">Select range...</option>
            <option value="Pre-revenue">Pre-revenue</option>
            <option value="$1k - $10k">$1k - $10k</option>
            <option value="$10k - $50k">$10k - $50k</option>
            <option value="$50k+">$50k+</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Services Interested In *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {[
            "Advanced Bookkeeping / Cleanup",
            "Business Planning",
            "Digital Handshake (Web Design)"
          ].map((svc) => (
            <label key={svc} className="flex items-center gap-3 p-3 border border-white/[0.06] rounded-lg cursor-pointer hover:bg-surface transition-colors bg-surface/50">
              <input
                type="checkbox"
                value={svc}
                {...register("servicesInterested")}
                className="w-4 h-4 accent-accent rounded border-white/10"
              />
              <span className="text-sm text-foreground">{svc}</span>
            </label>
          ))}
        </div>
        {errors.servicesInterested && <span role="alert" className="text-destructive text-xs mt-1 block">{errors.servicesInterested.message}</span>}
      </div>

      <div>
        <label htmlFor="detail-challenge" className={labelClass}>What is your biggest operational challenge right now? *</label>
        <textarea {...register("biggestChallenge")} id="detail-challenge" rows={4} className={`${inputClass} resize-none`} aria-describedby={errors.biggestChallenge ? "detail-challenge-error" : undefined} />
        {errors.biggestChallenge && <span id="detail-challenge-error" role="alert" className="text-destructive text-xs mt-1 block">{errors.biggestChallenge.message}</span>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="px-8 py-4 bg-accent text-white font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
      >
        <Send size={18} aria-hidden="true" />
        {isPending ? "Submitting Application..." : "Submit Discovery Application"}
      </button>
    </form>
  );
}
