import { deletePrint, getPrint, updatePrint } from "@/lib/data-store";
import type { QuoteInput } from "@/lib/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const print = await getPrint(id);

  if (!print) {
    return Response.json({ message: "Print not found." }, { status: 404 });
  }

  return Response.json(print);
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = (await request.json()) as QuoteInput;

  try {
    const print = await updatePrint(id, payload);
    if (!print) {
      return Response.json({ message: "Print not found." }, { status: 404 });
    }
    return Response.json(print);
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Unable to update print." },
      { status: 400 }
    );
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    await deletePrint(id);
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ message: "Print not found." }, { status: 404 });
  }
}
