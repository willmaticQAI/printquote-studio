import { QuoteSummaryPanel } from "@/components/calculator/QuoteSummaryPanel";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Select } from "@/components/ui/Select";

const formSections = [
  {
    title: "Job Details",
    description: "Customer, job name, and quantity for this quote.",
    fields: [
      { label: "Job name", placeholder: "Bracket mount v2", type: "text" },
      { label: "Customer", placeholder: "Acme Robotics", type: "text" },
      { label: "Quantity", placeholder: "1", type: "number" },
    ],
  },
  {
    title: "Filament Details",
    description: "Material profile, grams used, and waste allowance.",
    fields: [
      { label: "Filament profile", placeholder: "Select filament…", type: "select" },
      { label: "Grams used", placeholder: "42", type: "number" },
      { label: "Waste %", placeholder: "5", type: "number" },
    ],
  },
  {
    title: "Print Time",
    description: "Machine hours and electricity assumptions.",
    fields: [
      { label: "Print time (hours)", placeholder: "4.5", type: "number" },
      { label: "Machine rate ($/hr)", placeholder: "2.50", type: "number" },
      { label: "Power draw (W)", placeholder: "120", type: "number" },
    ],
  },
  {
    title: "Labor",
    description: "Post-processing and handling time.",
    fields: [
      { label: "Labor time (min)", placeholder: "15", type: "number" },
      { label: "Labor rate ($/hr)", placeholder: "25", type: "number" },
    ],
  },
  {
    title: "Profit",
    description: "Markup and minimum margin targets.",
    fields: [
      { label: "Profit margin %", placeholder: "30", type: "number" },
      { label: "Minimum price floor", placeholder: "0", type: "number" },
    ],
  },
  {
    title: "Bulk Pricing",
    description: "Quantity breaks and per-unit discounts.",
    fields: [
      { label: "Enable bulk tiers", placeholder: "", type: "select-bulk" },
      { label: "Tier 2 qty", placeholder: "10", type: "number" },
      { label: "Tier 2 discount %", placeholder: "5", type: "number" },
    ],
  },
];

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Calculator"
        description="Build a print quote step by step. Formulas and live pricing will connect in Phase 2 — layout is ready now."
        badge="Phase 2 — Logic"
        badgeVariant="outline"
        action={
          <Button variant="secondary" disabled>
            Save Quote
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {formSections.map((section) => (
            <Card key={section.title} hover>
              <CardHeader>
                <SectionHeader
                  title={section.title}
                  description={section.description}
                  badge="Placeholder"
                  badgeVariant="outline"
                />
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {section.fields.map((field) => {
                    if (field.type === "select") {
                      return (
                        <Select
                          key={field.label}
                          label={field.label}
                          disabled
                          defaultValue=""
                        >
                          <option value="">Select filament…</option>
                          <option value="pla">eSun PLA+ — Matte Black</option>
                          <option value="petg">Polymaker PETG — Clear</option>
                        </Select>
                      );
                    }
                    if (field.type === "select-bulk") {
                      return (
                        <Select
                          key={field.label}
                          label={field.label}
                          disabled
                          defaultValue="off"
                          className="sm:col-span-2"
                        >
                          <option value="off">Disabled</option>
                          <option value="on">Enabled</option>
                        </Select>
                      );
                    }
                    return (
                      <Input
                        key={field.label}
                        label={field.label}
                        type={field.type}
                        placeholder={field.placeholder}
                        disabled
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex flex-wrap gap-2">
            <Button disabled>Calculate</Button>
            <Button variant="secondary" disabled>
              Reset
            </Button>
            <Badge variant="outline" className="self-center">
              Inputs disabled until Phase 2
            </Badge>
          </div>
        </div>

        <QuoteSummaryPanel />
      </div>
    </div>
  );
}
