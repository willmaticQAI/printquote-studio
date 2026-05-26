import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  description?: string;
  badge?: string;
  badgeVariant?: "default" | "accent" | "outline" | "success" | "warning" | "danger";
  action?: ReactNode;
  className?: string;
};

export function SectionHeader({
  title,
  description,
  badge,
  badgeVariant = "outline",
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {badge ? <Badge variant={badgeVariant}>{badge}</Badge> : null}
        </div>
        {description ? (
          <p className="text-sm text-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
