import { CalculatorWorkspace } from "@/components/calculator/CalculatorWorkspace";
import { readAppData } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export default async function CalculatorPage() {
  const data = await readAppData();

  return (
    <CalculatorWorkspace filaments={data.filaments} settings={data.settings} />
  );
}
