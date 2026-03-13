import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, MapPin } from "lucide-react";
import { 
  useContactMutation, 
  quickContactSchema, 
  detailedContactSchema,
  type QuickContactValues,
  type DetailedContactValues
} from "@/hooks/use-contact";

export default function Contact() {
  return (
    <div className="pt-24 pb-20 bg-muted/20 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">Let's Talk Strategy</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the path that fits your timeline. Send a quick note or give us the details for a tailored discovery call.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Quick Contact Form - Left Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-card premium-shadow rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-2">Quick Message</h2>
              <p className="text-muted-foreground text-sm mb-6">Just have a question? Drop it here.</p>
              <QuickContactForm />
            </div>

            <div className="bg-primary text-white rounded-2xl p-8 premium-shadow">
              <h3 className="font-bold text-lg mb-6">Direct Channels</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-full"><Mail size={20} /></div>
                  <div>
                    <p className="text-xs text-primary-foreground/70 uppercase tracking-wider">Email</p>
                    <a href="mailto:tea@blueprintsandbookkeeping.com" className="font-medium hover:text-accent transition-colors">tea@blueprintsandbookkeeping.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-full"><Phone size={20} /></div>
                  <div>
                    <p className="text-xs text-primary-foreground/70 uppercase tracking-wider">Phone</p>
                    <a href="tel:+15413198654" className="font-medium hover:text-accent transition-colors">(541) 319-8654</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-full"><MapPin size={20} /></div>
                  <div>
                    <p className="text-xs text-primary-foreground/70 uppercase tracking-wider">Location</p>
                    <p className="font-medium">Roseburg, Oregon (Remote US)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Intake Form - Right Column */}
          <div className="lg:col-span-8 bg-card premium-shadow rounded-2xl p-8 md:p-10 border border-border">
            <h2 className="text-3xl font-display font-bold text-primary mb-2">Discovery Intake Form</h2>
            <p className="text-muted-foreground mb-8">Ready to dive in? Provide context about your operations so we can hit the ground running on our first call.</p>
            <DetailedIntakeForm />
          </div>

        </div>
      </section>
    </div>
  );
}

// --- FORM COMPONENTS ---

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input 
          {...register("name")} 
          placeholder="Name" 
          className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
        />
        {errors.name && <span className="text-destructive text-xs mt-1">{errors.name.message}</span>}
      </div>
      <div>
        <input 
          {...register("email")} 
          placeholder="Email Address" 
          type="email"
          className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
        />
        {errors.email && <span className="text-destructive text-xs mt-1">{errors.email.message}</span>}
      </div>
      <div>
        <textarea 
          {...register("message")} 
          placeholder="How can we help?" 
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
        />
        {errors.message && <span className="text-destructive text-xs mt-1">{errors.message.message}</span>}
      </div>
      <button 
        type="submit" 
        disabled={isPending}
        className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Your Name *</label>
          <input 
            {...register("name")} 
            className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
          />
          {errors.name && <span className="text-destructive text-xs mt-1">{errors.name.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Business Name *</label>
          <input 
            {...register("businessName")} 
            className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
          />
          {errors.businessName && <span className="text-destructive text-xs mt-1">{errors.businessName.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Email Address *</label>
          <input 
            {...register("email")} 
            type="email"
            className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
          />
          {errors.email && <span className="text-destructive text-xs mt-1">{errors.email.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
          <input 
            {...register("phone")} 
            type="tel"
            className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Industry *</label>
          <select 
            {...register("industry")}
            className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
          >
            <option value="">Select an industry...</option>
            <option value="Agriculture & Timber">Agriculture & Timber</option>
            <option value="Crypto/Digital Assets">Crypto / Digital Assets</option>
            <option value="E-commerce/Gig">E-commerce / Gig Economy</option>
            <option value="Tech/Startup">Tech / Startup</option>
            <option value="Real Estate/Multi-Entity">Real Estate / Holding</option>
            <option value="Other">Other</option>
          </select>
          {errors.industry && <span className="text-destructive text-xs mt-1">{errors.industry.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Avg. Monthly Revenue</label>
          <select 
            {...register("monthlyRevenueRange")}
            className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
          >
            <option value="">Select range...</option>
            <option value="Pre-revenue">Pre-revenue</option>
            <option value="$1k - $10k">$1k - $10k</option>
            <option value="$10k - $50k">$10k - $50k</option>
            <option value="$50k+">$50k+</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-3">Services Interested In *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Advanced Bookkeeping / Cleanup",
            "Business Planning (Lender-Ready)",
            "Digital Handshake (Web Design)",
            "Remote Online Notarization"
          ].map((svc) => (
            <label key={svc} className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <input 
                type="checkbox" 
                value={svc} 
                {...register("servicesInterested")}
                className="w-5 h-5 text-accent rounded border-border focus:ring-accent"
              />
              <span className="text-sm font-medium">{svc}</span>
            </label>
          ))}
        </div>
        {errors.servicesInterested && <span className="text-destructive text-xs mt-1 block">{errors.servicesInterested.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">What is your biggest operational challenge right now? *</label>
        <textarea 
          {...register("biggestChallenge")} 
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
        />
        {errors.biggestChallenge && <span className="text-destructive text-xs mt-1">{errors.biggestChallenge.message}</span>}
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="px-8 py-4 bg-accent text-white font-bold text-lg rounded-xl hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isPending ? "Submitting Application..." : "Submit Discovery Application"}
      </button>
    </form>
  );
}
