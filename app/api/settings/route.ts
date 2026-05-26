import { readAppData, updateAppData } from "@/lib/data-store";
import type { SettingsRecord } from "@/lib/types";

export async function GET() {
  const data = await readAppData();
  return Response.json(data.settings);
}

export async function PUT(request: Request) {
  const payload = (await request.json()) as Partial<SettingsRecord>;

  const next = await updateAppData((current) => ({
    ...current,
    settings: {
      ...current.settings,
      ...payload,
    },
  }));

  return Response.json(next.settings);
}
