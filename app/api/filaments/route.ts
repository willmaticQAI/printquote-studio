import { createFilament, listFilaments } from "@/lib/data-store";
import type { FilamentRecord } from "@/lib/types";

export async function GET() {
  return Response.json(await listFilaments());
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Omit<
    FilamentRecord,
    "id" | "createdAt" | "updatedAt"
  >;

  return Response.json(await createFilament(payload), { status: 201 });
}
