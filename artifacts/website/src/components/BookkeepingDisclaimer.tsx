import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookkeepingDisclaimerProps {
  className?: string;
  compact?: boolean;
  title?: string;
}

export function BookkeepingDisclaimer({
  className,
  compact = false,
  title = "Bookkeeping scope",
}: BookkeepingDisclaimerProps) {
  return (
    <aside
      role="note"
      className={cn(
        compact
          ? "rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
          : "rounded-2xl border border-white/10 bg-card/40 px-5 py-4",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "shrink-0 rounded-xl bg-accent/10 text-accent",
            compact ? "mt-0.5 p-2" : "mt-0.5 p-2.5",
          )}
        >
          <Info
            className={cn(compact ? "h-4 w-4" : "h-[18px] w-[18px]")}
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0">
          <p
            className={cn(
              "font-semibold text-foreground",
              compact ? "text-sm" : "text-sm sm:text-[15px]",
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              "mt-1 leading-relaxed text-muted-foreground",
              compact ? "text-xs sm:text-[13px]" : "text-sm sm:text-[14px]",
            )}
          >
            Blueprints &amp; Bookkeeping LLC provides bookkeeping and
            business-planning services only. Tax preparation, tax filing, legal
            advice, and licensed investment advice stay with the appropriate
            licensed professionals.
          </p>
        </div>
      </div>
    </aside>
  );
}
