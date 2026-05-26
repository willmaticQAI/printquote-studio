"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge, quoteStatusVariant } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { QUOTE_STATUSES } from "@/lib/constants";
import type { QuoteRecord, QuoteStatus } from "@/lib/types";
import {
  buttonStyles,
  formatCurrency,
  formatDate,
  formatPercent,
} from "@/lib/utils";

type QuotesManagerProps = {
  initialQuotes: QuoteRecord[];
  currency: string;
  locale: string;
};

export function QuotesManager({
  initialQuotes,
  currency,
  locale,
}: QuotesManagerProps) {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [filter, setFilter] = useState<QuoteStatus | "All">("All");

  const visibleQuotes = useMemo(
    () => quotes.filter((quote) => filter === "All" || quote.status === filter),
    [filter, quotes]
  );

  async function updateStatus(id: string, status: QuoteStatus) {
    const response = await fetch(`/api/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) return;

    const updated = (await response.json()) as QuoteRecord;
    setQuotes((current) =>
      current.map((quote) => (quote.id === updated.id ? updated : quote))
    );
  }

  async function deleteQuote(id: string) {
    if (!window.confirm("Delete this quote?")) return;

    const response = await fetch(`/api/quotes/${id}`, { method: "DELETE" });
    if (!response.ok) return;

    setQuotes((current) => current.filter((quote) => quote.id !== id));
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Quotes"
        description="Review saved quotes, update their status, edit them in the calculator, or delete them when they are no longer needed."
        badge="Pipeline"
        action={
          <Link href="/calculator" className={buttonStyles("primary")}>
            New Quote
          </Link>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-muted">Status:</span>
        <button
          type="button"
          onClick={() => setFilter("All")}
          className={buttonStyles(filter === "All" ? "primary" : "secondary")}
        >
          All
        </button>
        {QUOTE_STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={buttonStyles(filter === status ? "primary" : "secondary")}
          >
            {status}
          </button>
        ))}
      </div>

      {quotes.length === 0 ? (
        <EmptyState
          title="No saved quotes yet"
          description="Create a quote from the calculator and it will appear here immediately."
          action={
            <Link href="/calculator" className={buttonStyles("primary")}>
              Create First Quote
            </Link>
          }
        />
      ) : (
        <Card glow>
          <CardHeader>
            <CardTitle>All Quotes</CardTitle>
            <CardDescription>
              {visibleQuotes.length} of {quotes.length} quotes shown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                    <th className="pb-3 pr-4 font-medium">Quote</th>
                    <th className="pb-3 pr-4 font-medium">Customer</th>
                    <th className="pb-3 pr-4 font-medium">Job</th>
                    <th className="pb-3 pr-4 font-medium">Date</th>
                    <th className="pb-3 pr-4 font-medium">Total</th>
                    <th className="pb-3 pr-4 font-medium">Margin</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Update</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visibleQuotes.map((quote) => (
                    <tr
                      key={quote.id}
                      className="transition-colors hover:bg-panel-soft/50"
                    >
                      <td className="py-3.5 pr-4 font-mono text-xs text-accent">
                        {quote.quoteNumber}
                      </td>
                      <td className="py-3.5 pr-4 text-foreground">
                        {quote.customerName || "Walk-in"}
                      </td>
                      <td className="py-3.5 pr-4 text-foreground">
                        {quote.jobName}
                      </td>
                      <td className="py-3.5 pr-4 text-muted">
                        {formatDate(quote.createdAt, locale)}
                      </td>
                      <td className="py-3.5 pr-4 font-medium text-foreground">
                        {formatCurrency(quote.breakdown.finalTotal, currency, locale)}
                      </td>
                      <td className="py-3.5 pr-4 text-muted">
                        {formatPercent(quote.breakdown.marginPercent)}
                      </td>
                      <td className="py-3.5 pr-4">
                        <Badge variant={quoteStatusVariant(quote.status)}>
                          {quote.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 pr-4">
                        <Select
                          aria-label={`Update status for ${quote.quoteNumber}`}
                          value={quote.status}
                          onChange={(event) =>
                            updateStatus(quote.id, event.target.value as QuoteStatus)
                          }
                        >
                          {QUOTE_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </Select>
                      </td>
                      <td className="py-3.5">
                        <div className="flex gap-2">
                          <Link
                            href={`/calculator?quoteId=${quote.id}`}
                            className={buttonStyles("secondary", "px-3 py-1.5 text-xs")}
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            className={buttonStyles("ghost", "px-3 py-1.5 text-xs")}
                            onClick={() => deleteQuote(quote.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
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
