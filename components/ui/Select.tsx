import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
};

export function Select({
  className,
  label,
  hint,
  id,
  children,
  ...props
}: SelectProps) {
  const selectId =
    id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  const field = (
    <select
      id={selectId}
      className={cn(
        "w-full rounded-lg border border-border bg-panel-soft px-3 py-2 text-sm text-foreground transition-colors duration-200 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );

  if (!label && !hint) return field;

  return (
    <label className="block space-y-1.5" htmlFor={selectId}>
      {label ? (
        <span className="text-sm font-medium text-foreground">{label}</span>
      ) : null}
      {field}
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
}
