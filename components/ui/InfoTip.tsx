"use client";

type InfoTipProps = {
  label: string;
  description: string;
};

export function InfoTip({ label, description }: InfoTipProps) {
  return (
    <span className="group relative inline-flex">
      <span
        className="inline-flex h-5 w-5 cursor-help items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-[11px] font-semibold text-accent"
        aria-label={`${label}: ${description}`}
        tabIndex={0}
      >
        i
      </span>
      <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 hidden w-72 -translate-x-1/2 rounded-lg border border-border bg-panel px-3 py-2 text-xs leading-relaxed text-muted shadow-lg group-hover:block group-focus-within:block">
        <span className="mb-1 block text-sm font-medium text-foreground">{label}</span>
        {description}
      </span>
    </span>
  );
}
