import { PrintsManager } from "@/components/prints/PrintsManager";
import { readAppData } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export default async function PrintsPage() {
  const data = await readAppData();

  return (
    <PrintsManager
      initialPrints={data.prints}
      currency={data.settings.currency}
      locale={data.settings.locale}
    />
  );
}
