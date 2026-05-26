import { PageHeader } from "@/components/layout/PageHeader";
import { Badge, quoteStatusVariant } from "@/components/ui/Badge";
import { buttonStyles } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { PLACEHOLDER_QUOTES, QUOTE_STATUSES } from "@/lib/constants";
import Link from "next/link";

export default function QuotesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Quotes"
        description="Review saved quotes, track status from draft to completed, and export customer-ready summaries."
        badge="Pipeline"
        action={
          <Link href="/calculator" className={buttonStyles("primary")}>
            New Quote
          </Link>
        }
      />

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted self-center mr-1">Status:</span>
        {QUOTE_STATUSES.map((status) => (
          <Badge key={status} variant={quoteStatusVariant(status)}>
            {status}
          </Badge>
        ))}
      </div>

      <Card glow>
        <CardHeader>
          <CardTitle>All Quotes</CardTitle>
          <CardDescription>
            Placeholder table — local database CRUD arrives in Phase 3.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                  <th className="pb-3 pr-4 font-medium">ID</th>
                  <th className="pb-3 pr-4 font-medium">Customer</th>
                  <th className="pb-3 pr-4 font-medium">Job</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 pr-4 font-medium">Total</th>
                  <th className="pb-3 pr-4 font-medium">Margin</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {PLACEHOLDER_QUOTES.map((quote) => (
                  <tr
                    key={quote.id}
                    className="transition-colors hover:bg-panel-soft/50"
                  >
                    <td className="py-3.5 pr-4 font-mono text-xs text-accent">
                      {quote.id}
                    </td>
                    <td className="py-3.5 pr-4 text-foreground">
                      {quote.customer}
                    </td>
                    <td className="py-3.5 pr-4 text-foreground">
                      {quote.job}
                    </td>
                    <td className="py-3.5 pr-4 text-muted">{quote.date}</td>
                    <td className="py-3.5 pr-4 font-medium text-foreground">
                      {quote.total}
                    </td>
                    <td className="py-3.5 pr-4 text-muted">{quote.margin}</td>
                    <td className="py-3.5">
                      <Badge variant={quoteStatusVariant(quote.status)}>
                        {quote.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-xs text-muted">
            Showing placeholder data · {PLACEHOLDER_QUOTES.length} quotes
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
