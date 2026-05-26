import { getSettings, updateSettings } from "@/lib/data-store";
import type { SettingsRecord } from "@/lib/types";

export async function GET() {
  return Response.json(await getSettings());
}

export async function PUT(request: Request) {
  const payload = (await request.json()) as Partial<SettingsRecord>;
  return Response.json(await updateSettings(payload));
}
