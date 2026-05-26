"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { PrintRecord } from "@/lib/types";
import { buttonStyles, formatCurrency, formatDate, formatPercent } from "@/lib/utils";

type PrintsManagerProps = {
  initialPrints: PrintRecord[];
  currency: string;
  locale: string;
};

export function PrintsManager({
  initialPrints,
  currency,
  locale,
}: PrintsManagerProps) {
  const [prints] = useState(initialPrints);

  const totalPrintCost = useMemo(
    () => prints.reduce((sum, print) => sum + print.breakdown.subtotal, 0),
    [prints]
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Prints"
        description="Keep an internal history of jobs you produced so you can review what they actually cost."
        badge="History"
        action={<Badge variant="accent">{prints.length} saved</Badge>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card hover>
          <CardHeader>
            <CardTitle>Total Saved Prints</CardTitle>
            <CardDescription>Internal print records in your local history.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">{prints.length}</p>
          </CardContent>
        </Card>
        <Card hover>
          <CardHeader>
            <CardTitle>Total Cost Tracked</CardTitle>
            <CardDescription>Break-even cost across all saved prints.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">
              {formatCurrency(totalPrintCost, currency, locale)}
            </p>
          </CardContent>
        </Card>
        <Card hover>
          <CardHeader>
            <CardTitle>Review</CardTitle>
            <CardDescription>Jump back into the calculator for a new job.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/calculator" className={buttonStyles("primary")}>
              New Calculation
            </Link>
          </CardContent>
        </Card>
      </div>

      {prints.length === 0 ? (
        <EmptyState
          title="No print records yet"
          description="Use Save Print in the calculator for jobs that are not customer quotes but still need cost tracking."
          action={
            <Link href="/calculator" className={buttonStyles("primary")}>
              Create First Print Record
            </Link>
          }
        />
      ) : (
        <Card glow>
          <CardHeader>
            <CardTitle>Print History</CardTitle>
            <CardDescription>
              Review previous internal jobs, cost totals, and the margin assumptions you used.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                    <th className="pb-3 pr-4 font-medium">Print</th>
                    <th className="pb-3 pr-4 font-medium">Job</th>
                    <th className="pb-3 pr-4 font-medium">Filament</th>
                    <th className="pb-3 pr-4 font-medium">Date</th>
                    <th className="pb-3 pr-4 font-medium">Break-even</th>
                    <th className="pb-3 pr-4 font-medium">Final</th>
                    <th className="pb-3 pr-4 font-medium">Margin</th>
                    <th className="pb-3 font-medium">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {prints.map((print) => (
                    <tr key={print.id} className="transition-colors hover:bg-panel-soft/50">
                      <td className="py-3.5 pr-4 font-mono text-xs text-accent">
                        {print.printNumber}
                      </td>
                      <td className="py-3.5 pr-4 text-foreground">{print.jobName}</td>
                      <td className="py-3.5 pr-4 text-muted">{print.filamentLabel}</td>
                      <td className="py-3.5 pr-4 text-muted">
                        {formatDate(print.createdAt, locale)}
                      </td>
                      <td className="py-3.5 pr-4 text-foreground">
                        {formatCurrency(print.breakdown.subtotal, currency, locale)}
                      </td>
                      <td className="py-3.5 pr-4 font-medium text-foreground">
                        {formatCurrency(print.breakdown.finalTotal, currency, locale)}
                      </td>
                      <td className="py-3.5 pr-4 text-muted">
                        {formatPercent(print.breakdown.marginPercent)}
                      </td>
                      <td className="py-3.5 text-muted">{print.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
