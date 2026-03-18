import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookkeepingDisclaimerProps {
  className?: string;
}

export function BookkeepingDisclaimer({ className }: BookkeepingDisclaimerProps) {
  return (
    <aside
      role="note"
      className={cn("rounded-lg border border-white/10 bg-card/40 px-4 py-3", className)}
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 p-1.5 rounded-md bg-accent/10 text-accent shrink-0">
          <Info className="w-3.5 h-3.5" aria-hidden="true" />
        </div>
        <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Scope notice:</span>{" "}
          Blueprints &amp; Bookkeeping LLC provides bookkeeping and business-planning services only and does
          not provide tax preparation, tax filing, legal advice, or licensed investment counsel.
        </p>
      </div>
    </aside>
  );
}
