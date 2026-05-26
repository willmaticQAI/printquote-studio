import { createPrint, listPrints } from "@/lib/data-store";
import type { QuoteInput } from "@/lib/types";

export async function GET() {
  return Response.json(await listPrints());
}

export async function POST(request: Request) {
  const payload = (await request.json()) as QuoteInput;

  try {
    return Response.json(await createPrint(payload), { status: 201 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Unable to create print." },
      { status: 400 }
    );
  }
}
