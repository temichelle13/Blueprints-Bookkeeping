import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export function ScopeDisclaimer() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 px-5 py-4">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-[13px] leading-relaxed text-amber-200/80">
          <span className="font-semibold text-amber-300">Scope notice:</span> Blueprints &amp; Bookkeeping LLC is not a licensed CPA firm and does not provide tax preparation, tax filing, legal advice, or licensed investment counsel. References to tax forms (e.g., Schedule F, Schedule C) describe bookkeeping and record-keeping contexts only — not tax preparation services. For tax and legal matters, please consult a licensed professional.{" "}
          <Link href="/faq#taxes" className="underline underline-offset-2 hover:text-amber-300 transition-colors">
            Learn more in our FAQ
          </Link>
          {" "}or review our{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-amber-300 transition-colors">
            Terms of Service
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
