import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge, quoteStatusVariant } from "@/components/ui/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { readAppData } from "@/lib/data-store";
import { APP_CONSOLE_NAME } from "@/lib/constants";
import { buttonStyles, formatCurrency, formatDate, formatPercent } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await readAppData();

  const estimatedRevenue = data.quotes.reduce(
    (sum, quote) => sum + quote.breakdown.finalTotal,
    0
  );
  const averageMargin =
    data.quotes.length > 0
      ? data.quotes.reduce((sum, quote) => sum + quote.breakdown.marginPercent, 0) /
        data.quotes.length
      : 0;
  const lowStockCount = data.filaments.filter(
    (filament) => filament.remainingGrams / filament.spoolWeightGrams <= 0.2
  ).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Dashboard"
        description={`${APP_CONSOLE_NAME} - live overview of quotes, revenue, and inventory health.`}
        badge="Overview"
        action={
          <Link href="/calculator" className={buttonStyles("primary")}>
            New Quote
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Quotes" value={String(data.quotes.length)} change="Saved locally" changeType="neutral" />
        <StatCard
          label="Estimated Revenue"
          value={formatCurrency(
            estimatedRevenue,
            data.settings.currency,
            data.settings.locale
          )}
          change="From all saved quotes"
          changeType="positive"
        />
        <StatCard
          label="Average Margin"
          value={formatPercent(averageMargin)}
          change="Across saved quotes"
          changeType="positive"
        />
        <StatCard
          label="Low Spool Alerts"
          value={String(lowStockCount)}
          change="20% remaining or less"
          changeType={lowStockCount > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" hover glow>
          <CardHeader>
            <CardTitle>Recent Quotes</CardTitle>
            <CardDescription>
              Latest saved quotes from your local workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.quotes.length === 0 ? (
              <EmptyState
                title="No quotes saved yet"
                description="Create your first quote to populate the dashboard and quotes pipeline."
                action={
                  <Link href="/calculator" className={buttonStyles("primary")}>
                    Create First Quote
                  </Link>
                }
              />
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                        <th className="pb-3 pr-4 font-medium">Quote</th>
                        <th className="pb-3 pr-4 font-medium">Job</th>
                        <th className="pb-3 pr-4 font-medium">Total</th>
                        <th className="pb-3 pr-4 font-medium">Date</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {data.quotes.slice(0, 5).map((quote) => (
                        <tr key={quote.id} className="text-muted">
                          <td className="py-3 pr-4 font-mono text-xs text-accent">
                            {quote.quoteNumber}
                          </td>
                          <td className="py-3 pr-4 text-foreground">
                            {quote.jobName}
                          </td>
                          <td className="py-3 pr-4 font-medium text-foreground">
                            {formatCurrency(
                              quote.breakdown.finalTotal,
                              data.settings.currency,
                              data.settings.locale
                            )}
                          </td>
                          <td className="py-3 pr-4 text-muted">
                            {formatDate(quote.createdAt, data.settings.locale)}
                          </td>
                          <td className="py-3">
                            <Badge variant={quoteStatusVariant(quote.status)}>
                              {quote.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Link
                  href="/quotes"
                  className="mt-4 inline-block text-sm text-accent hover:underline"
                >
                  View all quotes →
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump into common workflows.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link href="/calculator" className={buttonStyles("primary", "w-full justify-center")}>
              Open Calculator
            </Link>
            <Link href="/filaments" className={buttonStyles("secondary", "w-full justify-center")}>
              Manage Filaments
            </Link>
            <Link href="/settings" className={buttonStyles("ghost", "w-full justify-center")}>
              Shop Settings
            </Link>
            <Link href="/prints" className={buttonStyles("ghost", "w-full justify-center")}>
              Print History
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card hover>
        <CardHeader>
          <CardTitle>Inventory Alerts</CardTitle>
          <CardDescription>Spools with low remaining material.</CardDescription>
        </CardHeader>
        <CardContent>
          {data.filaments.length === 0 ? (
            <EmptyState
              title="No inventory profiles yet"
              description="Add filament profiles to start tracking spool levels."
              action={
                <Link href="/filaments" className={buttonStyles("secondary")}>
                  Add Filament
                </Link>
              }
            />
          ) : (
            <ul className="space-y-3">
              {data.filaments.map((filament) => {
                const remainingRatio =
                  filament.remainingGrams / filament.spoolWeightGrams;
                return (
                  <li
                    key={filament.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-panel-soft px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {filament.brand} {filament.material} - {filament.colorName}
                      </p>
                      <p className="text-xs text-muted">
                        {filament.remainingGrams}g remaining
                      </p>
                    </div>
                    <Badge variant={remainingRatio <= 0.2 ? "warning" : "success"}>
                      {Math.round(remainingRatio * 100)}%
                    </Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
