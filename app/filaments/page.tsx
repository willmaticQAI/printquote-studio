import { FilamentsManager } from "@/components/filaments/FilamentsManager";
import { readAppData } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export default async function FilamentsPage() {
  const data = await readAppData();

  return (
    <FilamentsManager
      initialFilaments={data.filaments}
      currency={data.settings.currency}
      locale={data.settings.locale}
    />
  );
}
