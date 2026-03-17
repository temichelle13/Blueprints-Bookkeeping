import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { useNewsletterMutation } from "@/hooks/use-newsletter";

export function FooterNewsletterSignup() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { subscribe, isPending } = useNewsletterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const success = await subscribe({ email: email.trim(), signupSource: "footer", website: honeypot });
    if (success) {
      setSubscribed(true);
      setEmail("");
    }
  };

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 text-green-400 text-sm">
        <CheckCircle size={16} />
        <span>You're subscribed! Thank you.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex gap-2">
      <div className="pointer-events-none absolute opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
        <label htmlFor="footer-nl-website">Website</label>
        <input id="footer-nl-website" type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
      </div>
      <label htmlFor="footer-newsletter-email" className="sr-only">Email address</label>
      <input
        id="footer-newsletter-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex-1 min-w-0 px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
      />
      <button
        type="submit"
        disabled={isPending}
        className="shrink-0 px-4 py-2.5 bg-accent/15 border border-accent/30 text-accent font-semibold text-sm rounded-lg hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 disabled:opacity-50 flex items-center gap-1.5"
      >
        {isPending ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <Send size={14} aria-hidden="true" />}
        Subscribe
      </button>
    </form>
  );
}
