import { randomUUID } from "node:crypto";
import { readAppData, updateAppData } from "@/lib/data-store";
import type { FilamentRecord } from "@/lib/types";

export async function GET() {
  const data = await readAppData();
  return Response.json(data.filaments);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Omit<
    FilamentRecord,
    "id" | "createdAt" | "updatedAt"
  >;

  const now = new Date().toISOString();
  const filament: FilamentRecord = {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...payload,
  };

  const next = await updateAppData((current) => ({
    ...current,
    filaments: [filament, ...current.filaments],
  }));

  return Response.json(next.filaments[0], { status: 201 });
}
