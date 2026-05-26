import { SettingsManager } from "@/components/settings/SettingsManager";
import { readAppData } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const data = await readAppData();
  return <SettingsManager initialSettings={data.settings} />;
}
