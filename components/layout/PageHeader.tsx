import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  badge?: string;
  badgeVariant?: "default" | "accent" | "outline" | "success" | "warning" | "danger";
  action?: ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  badge,
  badgeVariant = "accent",
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h2>
          {badge ? <Badge variant={badgeVariant}>{badge}</Badge> : null}
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
