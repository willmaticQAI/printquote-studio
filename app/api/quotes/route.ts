import { createQuote, listQuotes } from "@/lib/data-store";
import type { QuoteInput } from "@/lib/types";

export async function GET() {
  return Response.json(await listQuotes());
}

export async function POST(request: Request) {
  const payload = (await request.json()) as QuoteInput;

  try {
    return Response.json(await createQuote(payload), { status: 201 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Unable to create quote." },
      { status: 400 }
    );
  }
}
