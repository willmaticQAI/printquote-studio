import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export function Input({ className, label, hint, id, ...props }: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  const field = (
    <input
      id={inputId}
      className={cn(
        "w-full rounded-lg border border-border bg-panel-soft px-3 py-2 text-sm text-foreground transition-colors duration-200 placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );

  if (!label && !hint) return field;

  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      {label ? (
        <span className="text-sm font-medium text-foreground">{label}</span>
      ) : null}
      {field}
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
}
