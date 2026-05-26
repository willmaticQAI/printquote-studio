export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export type ButtonVariant = "primary" | "secondary" | "ghost";

const buttonVariantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-background hover:bg-accent/90 border border-accent/20 shadow-sm shadow-accent/10",
  secondary:
    "bg-panel-soft text-foreground hover:bg-panel border border-border",
  ghost:
    "bg-transparent text-foreground hover:bg-panel-soft border border-transparent",
};

export function buttonStyles(
  variant: ButtonVariant = "primary",
  className?: string
): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50",
    buttonVariantStyles[variant],
    className
  );
}

export function formatCurrency(value: number, currency = "USD", locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function formatDate(value: string, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
