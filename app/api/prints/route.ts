import { buildPrintRecord } from "@/lib/quote-calculations";
import { readAppData, updateAppData } from "@/lib/data-store";
import type { QuoteInput } from "@/lib/types";

export async function GET() {
  const data = await readAppData();
  return Response.json(data.prints);
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

  const print = buildPrintRecord(payload, filament, data.settings, data.prints);

  const next = await updateAppData((current) => ({
    ...current,
    prints: [print, ...current.prints],
  }));

  return Response.json(next.prints[0], { status: 201 });
}
