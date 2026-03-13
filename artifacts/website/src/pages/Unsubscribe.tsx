import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useUnsubscribeNewsletter } from "@workspace/api-client-react";
import { usePageTitle } from "@/hooks/use-page-title";

type PageState = "form" | "success" | "error";

export default function Unsubscribe() {
  usePageTitle("Unsubscribe");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<PageState>("form");
  const mutation = useUnsubscribeNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await mutation.mutateAsync({ data: { email: email.trim() } });
      setState("success");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-auto px-4"
      >
        <div className="glass-card rounded-2xl p-8 text-center">
          {state === "success" ? (
            <>
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h1 className="text-2xl font-display font-bold text-white mb-3">
                You've Been Unsubscribed
              </h1>
              <p className="text-muted-foreground">
                Your email has been removed from our list. We're sorry to see you go.
              </p>
            </>
          ) : state === "error" ? (
            <>
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-display font-bold text-white mb-3">
                Something Went Wrong
              </h1>
              <p className="text-muted-foreground mb-6">
                We couldn't process your request. Please try again.
              </p>
              <button
                onClick={() => setState("form")}
                className="px-6 py-3 bg-white/[0.06] border border-white/10 text-white font-semibold rounded-lg hover:bg-white/[0.1] transition-all"
              >
                Try Again
              </button>
            </>
          ) : (
            <>
              <Mail className="w-12 h-12 text-accent mx-auto mb-4" />
              <h1 className="text-2xl font-display font-bold text-white mb-3">
                Unsubscribe
              </h1>
              <p className="text-muted-foreground mb-6">
                Enter your email address to unsubscribe from our newsletter.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
                />
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full px-6 py-3 bg-white/[0.06] border border-white/10 text-white font-semibold rounded-lg hover:bg-white/[0.1] transition-all disabled:opacity-50"
                >
                  {mutation.isPending ? "Processing..." : "Unsubscribe"}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
