import { PageHeader } from "@/components/layout/PageHeader";
import { buttonStyles } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge, quoteStatusVariant } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { APP_CONSOLE_NAME, PLACEHOLDER_QUOTES } from "@/lib/constants";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Dashboard"
        description={`${APP_CONSOLE_NAME} — overview of quotes, revenue estimates, and inventory at a glance.`}
        badge="Overview"
        action={
          <Link href="/calculator" className={buttonStyles("primary")}>
            New Quote
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Quotes"
          value="24"
          change="+3 this week"
          changeType="positive"
        />
        <StatCard
          label="Estimated Revenue"
          value="$2,840"
          change="Placeholder data"
          changeType="neutral"
        />
        <StatCard
          label="Average Margin"
          value="31%"
          change="Target: 30%+"
          changeType="positive"
        />
        <StatCard
          label="Low Spool Alerts"
          value="2"
          change="Review filaments"
          changeType="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" hover glow>
          <CardHeader>
            <CardTitle>Recent Quotes</CardTitle>
            <CardDescription>
              Latest saved quotes — persistence arrives in Phase 3.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                    <th className="pb-3 pr-4 font-medium">ID</th>
                    <th className="pb-3 pr-4 font-medium">Job</th>
                    <th className="pb-3 pr-4 font-medium">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {PLACEHOLDER_QUOTES.slice(0, 3).map((quote) => (
                    <tr key={quote.id} className="text-muted">
                      <td className="py-3 pr-4 font-mono text-xs text-accent">
                        {quote.id}
                      </td>
                      <td className="py-3 pr-4 text-foreground">
                        {quote.job}
                      </td>
                      <td className="py-3 pr-4 font-medium text-foreground">
                        {quote.total}
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
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump into common workflows.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link
              href="/calculator"
              className={buttonStyles("primary", "w-full justify-center")}
            >
              Open Calculator
            </Link>
            <Link
              href="/filaments"
              className={buttonStyles("secondary", "w-full justify-center")}
            >
              Manage Filaments
            </Link>
            <Link
              href="/settings"
              className={buttonStyles("ghost", "w-full justify-center")}
            >
              Shop Settings
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card hover>
        <CardHeader>
          <CardTitle>Inventory Alerts</CardTitle>
          <CardDescription>
            Spools running low — based on placeholder inventory data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-center justify-between rounded-lg border border-warning/30 bg-warning/5 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Polymaker PETG — Clear
                </p>
                <p className="text-xs text-muted">18% remaining</p>
              </div>
              <Badge variant="warning">Low stock</Badge>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-border bg-panel-soft px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  eSun PLA+ — Matte Black
                </p>
                <p className="text-xs text-muted">62% remaining</p>
              </div>
              <Badge variant="success">OK</Badge>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
