import { CalculatorWorkspace } from "@/components/calculator/CalculatorWorkspace";
import { getPrint, getQuote, readAppData } from "@/lib/data-store";
import type { QuoteInput } from "@/lib/types";

export const dynamic = "force-dynamic";

type CalculatorPageProps = {
  searchParams: Promise<{
    quoteId?: string;
    printId?: string;
  }>;
};

export default async function CalculatorPage({
  searchParams,
}: CalculatorPageProps) {
  const [data, params] = await Promise.all([readAppData(), searchParams]);

  let initialRecord: {
    kind: "quote" | "print";
    id: string;
    label: string;
    form: QuoteInput;
  } | null = null;

  if (params.quoteId) {
    const quote = await getQuote(params.quoteId);
    if (quote) {
      initialRecord = {
        kind: "quote",
        id: quote.id,
        label: quote.quoteNumber,
        form: {
          customerName: quote.customerName,
          jobName: quote.jobName,
          quantity: quote.quantity,
          filamentId: quote.filamentId,
          gramsUsed: quote.gramsUsed,
          wastePercent: quote.wastePercent,
          printHours: quote.printHours,
          machineRate: quote.machineRate,
          powerDrawWatts: quote.powerDrawWatts,
          electricityCostPerKwh: quote.electricityCostPerKwh,
          laborMinutes: quote.laborMinutes,
          laborRate: quote.laborRate,
          profitMargin: quote.profitMargin,
          minimumPriceFloor: quote.minimumPriceFloor,
          bulkEnabled: quote.bulkEnabled,
          tier2Qty: quote.tier2Qty,
          tier2DiscountPercent: quote.tier2DiscountPercent,
          notes: quote.notes,
          status: quote.status,
        },
      };
    }
  } else if (params.printId) {
    const print = await getPrint(params.printId);
    if (print) {
      initialRecord = {
        kind: "print",
        id: print.id,
        label: print.printNumber,
        form: {
          customerName: print.customerName,
          jobName: print.jobName,
          quantity: print.quantity,
          filamentId: print.filamentId,
          gramsUsed: print.gramsUsed,
          wastePercent: print.wastePercent,
          printHours: print.printHours,
          machineRate: print.machineRate,
          powerDrawWatts: print.powerDrawWatts,
          electricityCostPerKwh: print.electricityCostPerKwh,
          laborMinutes: print.laborMinutes,
          laborRate: print.laborRate,
          profitMargin: print.profitMargin,
          minimumPriceFloor: print.minimumPriceFloor,
          bulkEnabled: print.bulkEnabled,
          tier2Qty: print.tier2Qty,
          tier2DiscountPercent: print.tier2DiscountPercent,
          notes: print.notes,
          status: "Draft",
        },
      };
    }
  }

  return (
    <CalculatorWorkspace
      filaments={data.filaments}
      settings={data.settings}
      initialRecord={initialRecord}
    />
  );
}
