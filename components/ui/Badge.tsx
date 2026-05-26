import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type BadgeVariant =
  | "default"
  | "accent"
  | "outline"
  | "success"
  | "warning"
  | "danger";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-panel-soft text-foreground border-border",
  accent: "bg-accent/15 text-accent border-accent/30",
  outline: "bg-transparent text-muted border-border",
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  danger: "bg-danger/15 text-danger border-danger/30",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export function quoteStatusVariant(
  status: string
): BadgeVariant {
  switch (status) {
    case "Draft":
      return "outline";
    case "Quoted":
      return "accent";
    case "Accepted":
      return "success";
    case "Completed":
      return "default";
    default:
      return "default";
  }
}
