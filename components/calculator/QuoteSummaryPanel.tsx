import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const breakdownItems = [
  { label: "Material cost", value: "$—" },
  { label: "Machine time", value: "$—" },
  { label: "Electricity", value: "$—" },
  { label: "Labor", value: "$—" },
  { label: "Overhead / waste", value: "$—" },
];

export function QuoteSummaryPanel({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <Card glow className="sticky top-20 p-5 lg:top-24">
        <CardHeader className="mb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base">Quote Summary</CardTitle>
            <Badge variant="outline">Preview</Badge>
          </div>
          <p className="text-xs text-muted">
            Live totals will update when calculator logic is enabled in Phase 2.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg border border-accent/25 bg-accent/5 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              Suggested Price
            </p>
            <p className="mt-1 text-3xl font-semibold text-accent">$—</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SummaryMetric label="Break-even" value="$—" />
            <SummaryMetric label="Profit" value="$—" />
          </div>

          <div className="rounded-lg border border-border bg-panel-soft px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Final Total
              </span>
              <span className="text-lg font-semibold text-foreground">$—</span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
              Breakdown
            </p>
            <ul className="space-y-1.5">
              {breakdownItems.map((item) => (
                <li
                  key={item.label}
                  className="flex justify-between text-sm text-muted"
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-foreground">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border pt-3">
            <Badge variant="warning">No filament selected</Badge>
            <Badge variant="outline">Formulas pending</Badge>
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
