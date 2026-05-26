import { deleteQuote, getQuote, updateQuote, updateQuoteStatus } from "@/lib/data-store";
import type { QuoteInput, QuoteStatus } from "@/lib/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const quote = await getQuote(id);

  if (!quote) {
    return Response.json({ message: "Quote not found." }, { status: 404 });
  }

  return Response.json(quote);
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = (await request.json()) as QuoteInput;

  try {
    const quote = await updateQuote(id, payload);
    if (!quote) {
      return Response.json({ message: "Quote not found." }, { status: 404 });
    }
    return Response.json(quote);
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Unable to update quote." },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = (await request.json()) as { status: QuoteStatus };

  try {
    const quote = await updateQuoteStatus(id, payload.status);
    return Response.json(quote);
  } catch {
    return Response.json({ message: "Quote not found." }, { status: 404 });
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    await deleteQuote(id);
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ message: "Quote not found." }, { status: 404 });
  }
}
