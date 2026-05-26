import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral" | "warning";
  icon?: ReactNode;
  className?: string;
};

const changeVariant = {
  positive: "success" as const,
  negative: "danger" as const,
  neutral: "outline" as const,
  warning: "warning" as const,
};

export function StatCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "panel-glow card-hover rounded-xl border border-border bg-panel p-5",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          {label}
        </p>
        {icon ? (
          <span className="text-accent opacity-80">{icon}</span>
        ) : null}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {change ? (
        <div className="mt-3">
          <Badge variant={changeVariant[changeType]}>{change}</Badge>
        </div>
      ) : null}
    </div>
  );
}
