"use client";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";
import type { QuoteBreakdown } from "@/lib/types";

type QuoteSummaryPanelProps = {
  breakdown: QuoteBreakdown;
  currency: string;
  locale: string;
  filamentSelected: boolean;
  ready: boolean;
  className?: string;
};

const breakdownLabels = [
  "materialCost",
  "wasteCost",
  "machineCost",
  "electricityCost",
  "laborCost",
  "bulkDiscount",
] as const satisfies ReadonlyArray<keyof QuoteBreakdown>;

const labelMap: Record<(typeof breakdownLabels)[number], string> = {
  materialCost: "Material cost",
  wasteCost: "Waste allowance",
  machineCost: "Machine time",
  electricityCost: "Electricity",
  laborCost: "Labor",
  bulkDiscount: "Bulk discount",
};

export function QuoteSummaryPanel({
  breakdown,
  currency,
  locale,
  filamentSelected,
  ready,
  className,
}: QuoteSummaryPanelProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <Card glow className="sticky top-20 p-5 lg:top-24">
        <CardHeader className="mb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base">Quote Summary</CardTitle>
            <Badge variant="accent">Live</Badge>
          </div>
          <p className="text-xs text-muted">
            Use the calculate button to snapshot the current form into a cost summary.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg border border-accent/25 bg-accent/5 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              Suggested Price
            </p>
            <p className="mt-1 text-3xl font-semibold text-accent">
              {ready
                ? formatCurrency(breakdown.suggestedPrice, currency, locale)
                : "$--"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SummaryMetric
              label="Break-even"
              value={ready ? formatCurrency(breakdown.subtotal, currency, locale) : "$--"}
            />
            <SummaryMetric
              label="Profit"
              value={
                ready ? formatCurrency(breakdown.profitAmount, currency, locale) : "$--"
              }
            />
          </div>

          <div className="rounded-lg border border-border bg-panel-soft px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Final Total
              </span>
              <span className="text-lg font-semibold text-foreground">
                {ready ? formatCurrency(breakdown.finalTotal, currency, locale) : "$--"}
              </span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
              Breakdown
            </p>
            <ul className="space-y-1.5">
              {breakdownLabels.map((key) => (
                <li key={key} className="flex justify-between text-sm text-muted">
                  <span>{labelMap[key]}</span>
                  <span className="font-mono text-foreground">
                    {ready ? formatCurrency(breakdown[key], currency, locale) : "$--"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border pt-3">
            <Badge variant={filamentSelected ? "success" : "warning"}>
              {filamentSelected ? "Filament selected" : "Select a filament"}
            </Badge>
            <Badge variant="outline">
              {ready ? `Margin ${formatPercent(breakdown.marginPercent)}` : "Run calculate"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-panel-soft px-3 py-2.5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
