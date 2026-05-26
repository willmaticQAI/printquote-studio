import { buildQuoteRecord } from "@/lib/quote-calculations";
import { readAppData, updateAppData } from "@/lib/data-store";
import type { QuoteInput, QuoteRecord, QuoteStatus } from "@/lib/types";

export async function GET() {
  const data = await readAppData();
  return Response.json(data.quotes);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as QuoteInput;
  const data = await readAppData();
  const filament = data.filaments.find((item) => item.id === payload.filamentId);

  if (!filament) {
    return Response.json(
      { message: "Selected filament profile was not found." },
      { status: 400 }
    );
  }

  const quote = buildQuoteRecord(payload, filament, data.settings, data.quotes);

  const next = await updateAppData((current) => ({
    ...current,
    quotes: [quote, ...current.quotes],
  }));

  return Response.json(next.quotes[0], { status: 201 });
}

export async function PATCH(request: Request) {
  const payload = (await request.json()) as {
    id: string;
    status: QuoteStatus;
  };

  let updatedQuote: QuoteRecord | undefined;

  await updateAppData((current) => {
    const quotes = current.quotes.map((quote) => {
      if (quote.id !== payload.id) return quote;

      updatedQuote = {
        ...quote,
        status: payload.status,
        updatedAt: new Date().toISOString(),
      };
      return updatedQuote;
    });

    return {
      ...current,
      quotes,
    };
  });

  if (!updatedQuote) {
    return Response.json({ message: "Quote not found." }, { status: 404 });
  }

  return Response.json(updatedQuote);
}
