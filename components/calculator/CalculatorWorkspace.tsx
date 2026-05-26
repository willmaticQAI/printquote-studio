"use client";

import { useEffect, useMemo, useState } from "react";
import { QuoteSummaryPanel } from "@/components/calculator/QuoteSummaryPanel";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { InfoTip } from "@/components/ui/InfoTip";
import { Input } from "@/components/ui/Input";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Select } from "@/components/ui/Select";
import {
  buildDefaultQuoteInput,
  calculateQuoteBreakdown,
} from "@/lib/quote-calculations";
import type {
  FilamentRecord,
  PrintRecord,
  QuoteBreakdown,
  QuoteInput,
  QuoteRecord,
  QuoteStatus,
  SettingsRecord,
} from "@/lib/types";

type EditableRecord = {
  kind: "quote" | "print";
  id: string;
  label: string;
  form: QuoteInput;
};

type CalculatorWorkspaceProps = {
  filaments: FilamentRecord[];
  settings: SettingsRecord;
  initialRecord?: EditableRecord | null;
};

const emptyBreakdown: QuoteBreakdown = {
  materialCost: 0,
  wasteCost: 0,
  machineCost: 0,
  electricityCost: 0,
  laborCost: 0,
  subtotal: 0,
  bulkDiscount: 0,
  suggestedPrice: 0,
  finalTotal: 0,
  profitAmount: 0,
  marginPercent: 0,
};

export function CalculatorWorkspace({
  filaments,
  settings,
  initialRecord = null,
}: CalculatorWorkspaceProps) {
  const [form, setForm] = useState<QuoteInput>(
    initialRecord?.form ?? buildDefaultQuoteInput(settings, filaments[0]?.id ?? "")
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [calculatedBreakdown, setCalculatedBreakdown] = useState<QuoteBreakdown | null>(
    initialRecord ? null : null
  );
  const [editingRecord, setEditingRecord] = useState<EditableRecord | null>(
    initialRecord
  );

  useEffect(() => {
    setEditingRecord(initialRecord);
    setForm(initialRecord?.form ?? buildDefaultQuoteInput(settings, filaments[0]?.id ?? ""));
    setCalculatedBreakdown(null);
    setMessage("");
  }, [filaments, initialRecord, settings]);

  const selectedFilament = useMemo(
    () => filaments.find((filament) => filament.id === form.filamentId) ?? filaments[0],
    [filaments, form.filamentId]
  );

  const breakdown = useMemo(() => {
    if (!selectedFilament) return emptyBreakdown;
    return calculateQuoteBreakdown(form, selectedFilament, settings);
  }, [form, selectedFilament, settings]);

  useEffect(() => {
    setCalculatedBreakdown(null);
  }, [form]);

  function resetForm() {
    setForm(buildDefaultQuoteInput(settings, filaments[0]?.id ?? ""));
    setEditingRecord(null);
    setCalculatedBreakdown(null);
    setMessage("");
  }

  function calculateSummary() {
    if (!selectedFilament) {
      setMessage("Add a filament profile first.");
      return;
    }

    setCalculatedBreakdown(breakdown);
    setMessage("Quote summary updated.");
  }

  async function saveQuote(status: QuoteStatus) {
    if (!selectedFilament) {
      setMessage("Add a filament profile first.");
      return;
    }

    setSaving(true);
    setMessage("");

    const response = await fetch(
      editingRecord?.kind === "quote"
        ? `/api/quotes/${editingRecord.id}`
        : "/api/quotes",
      {
        method: editingRecord?.kind === "quote" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status,
          filamentId: selectedFilament.id,
        }),
      }
    );

    const payload = (await response.json()) as QuoteRecord | { message: string };

    if (!response.ok) {
      setMessage("message" in payload ? payload.message : "Unable to save quote.");
      setSaving(false);
      return;
    }

    const saved = payload as QuoteRecord;
    const nextRecord: EditableRecord = {
      kind: "quote",
      id: saved.id,
      label: saved.quoteNumber,
      form: recordToForm(saved),
    };
    setEditingRecord(nextRecord);
    setForm(nextRecord.form);
    setMessage(
      editingRecord?.kind === "quote"
        ? `Updated ${saved.quoteNumber}.`
        : `Saved ${saved.quoteNumber} as ${saved.status}.`
    );
    setSaving(false);
  }

  async function savePrint() {
    if (!selectedFilament) {
      setMessage("Add a filament profile first.");
      return;
    }

    setSaving(true);
    setMessage("");

    const response = await fetch(
      editingRecord?.kind === "print"
        ? `/api/prints/${editingRecord.id}`
        : "/api/prints",
      {
        method: editingRecord?.kind === "print" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          filamentId: selectedFilament.id,
        }),
      }
    );

    const payload = (await response.json()) as PrintRecord | { message: string };

    if (!response.ok) {
      setMessage("message" in payload ? payload.message : "Unable to save print.");
      setSaving(false);
      return;
    }

    const saved = payload as PrintRecord;
    const nextRecord: EditableRecord = {
      kind: "print",
      id: saved.id,
      label: saved.printNumber,
      form: recordToForm(saved),
    };
    setEditingRecord(nextRecord);
    setForm(nextRecord.form);
    setMessage(
      editingRecord?.kind === "print"
        ? `Updated ${saved.printNumber}.`
        : `Saved ${saved.printNumber} to print history.`
    );
    setSaving(false);
  }

  function updateNumber<K extends keyof QuoteInput>(key: K, value: string) {
    setForm((current) => ({
      ...current,
      [key]: Number(value),
    }));
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Calculator"
        description={
          editingRecord
            ? `Editing ${editingRecord.label}. Update the stored record, or reset to start a fresh quote or print.`
            : "Build a cost summary, then save the job either as a customer quote or as an internal print record."
        }
        badge={editingRecord ? `Editing ${editingRecord.kind}` : "Ready"}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={resetForm}>
              {editingRecord ? "Exit Edit" : "Reset"}
            </Button>
          </div>
        }
      />

      {filaments.length === 0 ? (
        <Card glow>
          <CardHeader>
            <SectionHeader
              title="Add a filament profile first"
              description="The calculator needs at least one saved material profile before it can price and save a quote."
              badge="Blocked"
              badgeVariant="warning"
            />
          </CardHeader>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <Card hover>
            <CardHeader>
              <SectionHeader
                title="Job Details"
                description="Customer, job name, and quantity for this quote."
                badge="Active"
                badgeVariant="success"
              />
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Job name"
                value={form.jobName}
                onChange={(event) =>
                  setForm((current) => ({ ...current, jobName: event.target.value }))
                }
              />
              <Input
                label="Customer"
                value={form.customerName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    customerName: event.target.value,
                  }))
                }
              />
              <Input
                label="Quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={(event) => updateNumber("quantity", event.target.value)}
                labelAddon={
                  <InfoTip
                    label="Quantity"
                    description="This is the number of finished parts you plan to make in the job. It multiplies the material usage and helps the summary reflect the true batch cost."
                  />
                }
              />
              <Select
                label="Quote status"
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value as QuoteStatus,
                  }))
                }
              >
                <option value="Draft">Draft</option>
                <option value="Quoted">Quoted</option>
                <option value="Accepted">Accepted</option>
                <option value="Completed">Completed</option>
              </Select>
            </CardContent>
          </Card>

          <Card hover>
            <CardHeader>
              <SectionHeader
                title="Filament Details"
                description="Select a saved profile and enter material usage."
                badge="Active"
                badgeVariant="success"
              />
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Filament profile"
                value={form.filamentId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    filamentId: event.target.value,
                  }))
                }
              >
                {filaments.map((filament) => (
                  <option key={filament.id} value={filament.id}>
                    {filament.brand} {filament.material} - {filament.colorName}
                  </option>
                ))}
              </Select>
              <Input
                label="Grams used per part"
                type="number"
                step="0.1"
                value={form.gramsUsed}
                onChange={(event) => updateNumber("gramsUsed", event.target.value)}
                labelAddon={
                  <InfoTip
                    label="Grams used per part"
                    description="Enter how much filament one printed part consumes before waste is added. You can usually get this from your slicer estimate or by weighing a completed part."
                  />
                }
              />
              <Input
                label="Waste %"
                type="number"
                step="0.1"
                value={form.wastePercent}
                onChange={(event) => updateNumber("wastePercent", event.target.value)}
                labelAddon={
                  <InfoTip
                    label="Waste percentage"
                    description="This adds extra material cost for purge lines, failed starts, supports, and normal shop waste. Use a small buffer when your slicer or printer estimates are not perfectly reliable."
                  />
                }
              />
            </CardContent>
          </Card>

          <Card hover>
            <CardHeader>
              <SectionHeader
                title="Print Time"
                description="Machine hours and electricity assumptions."
                badge="Active"
                badgeVariant="success"
              />
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Print time (hours)"
                type="number"
                step="0.1"
                value={form.printHours}
                onChange={(event) => updateNumber("printHours", event.target.value)}
                labelAddon={
                  <InfoTip
                    label="Print time"
                    description="This is the total machine runtime for the job in hours. Most slicers estimate this, and it drives both machine-cost and electricity-cost calculations."
                  />
                }
              />
              <Input
                label="Machine rate ($/hr)"
                type="number"
                step="0.01"
                value={form.machineRate}
                onChange={(event) => updateNumber("machineRate", event.target.value)}
                labelAddon={
                  <InfoTip
                    label="Machine rate"
                    description="Use this if you want to recover printer wear, maintenance, depreciation, and general machine overhead per hour. If you do not track that yet, you can leave it at zero and still calculate material and power costs."
                  />
                }
              />
              <Input
                label="Power draw (W)"
                type="number"
                value={form.powerDrawWatts}
                onChange={(event) => updateNumber("powerDrawWatts", event.target.value)}
                labelAddon={
                  <InfoTip
                    label="Power draw"
                    description="This is the average watt usage of the printer while the job runs. If your machine does not report it, use the printer specs or a watt meter estimate and adjust later if needed."
                  />
                }
              />
              <Input
                label="Electricity cost ($/kWh)"
                type="number"
                step="0.01"
                value={form.electricityCostPerKwh}
                onChange={(event) =>
                  updateNumber("electricityCostPerKwh", event.target.value)
                }
                labelAddon={
                  <InfoTip
                    label="Electricity cost"
                    description="This is your local utility rate per kilowatt-hour. It converts power draw and runtime into a real electricity cost for the print."
                  />
                }
              />
            </CardContent>
          </Card>

          <Card hover>
            <CardHeader>
              <SectionHeader
                title="Labor, Margin & Bulk Pricing"
                description="Post-processing, margin target, and optional quantity discount."
                badge="Active"
                badgeVariant="success"
              />
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Labor time (min)"
                type="number"
                value={form.laborMinutes}
                onChange={(event) => updateNumber("laborMinutes", event.target.value)}
                labelAddon={
                  <InfoTip
                    label="Labor time"
                    description="Use this for setup, cleanup, support removal, packaging, and any hands-on work outside the machine runtime. It helps you price jobs that consume your time even when the printer is idle."
                  />
                }
              />
              <Input
                label="Labor rate ($/hr)"
                type="number"
                step="0.01"
                value={form.laborRate}
                onChange={(event) => updateNumber("laborRate", event.target.value)}
                labelAddon={
                  <InfoTip
                    label="Labor rate"
                    description="This is the hourly value of your manual work. Even if a print is not for sale, tracking labor lets you see what a job truly cost you to complete."
                  />
                }
              />
              <Input
                label="Profit margin %"
                type="number"
                step="0.1"
                value={form.profitMargin}
                onChange={(event) => updateNumber("profitMargin", event.target.value)}
                labelAddon={
                  <InfoTip
                    label="Profit margin"
                    description="This adds profit above break-even cost for customer-facing quotes. For internal prints, you can leave it at zero if you only want cost tracking."
                  />
                }
              />
              <Input
                label="Minimum price floor"
                type="number"
                step="0.01"
                value={form.minimumPriceFloor}
                onChange={(event) =>
                  updateNumber("minimumPriceFloor", event.target.value)
                }
                labelAddon={
                  <InfoTip
                    label="Minimum price floor"
                    description="This prevents the final quote from dropping below a fixed amount even when calculated costs are low. It is useful when you want a minimum job charge for small prints."
                  />
                }
              />
              <Select
                label="Bulk pricing"
                value={form.bulkEnabled ? "on" : "off"}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    bulkEnabled: event.target.value === "on",
                  }))
                }
              >
                <option value="off">Disabled</option>
                <option value="on">Enabled</option>
              </Select>
              <Input
                label="Tier 2 quantity"
                type="number"
                value={form.tier2Qty}
                onChange={(event) => updateNumber("tier2Qty", event.target.value)}
                labelAddon={
                  <InfoTip
                    label="Tier 2 quantity"
                    description="This is the batch size where a bulk discount starts applying. Use it if larger orders get a lower per-unit selling price."
                  />
                }
              />
              <Input
                label="Tier 2 discount %"
                type="number"
                step="0.1"
                value={form.tier2DiscountPercent}
                onChange={(event) =>
                  updateNumber("tier2DiscountPercent", event.target.value)
                }
                labelAddon={
                  <InfoTip
                    label="Tier 2 discount"
                    description="This reduces the selling price once the order reaches the quantity threshold above. It is only used for quotes, not for understanding your raw print cost."
                  />
                }
              />
              <label className="block space-y-1.5 sm:col-span-2">
                <span className="text-sm font-medium text-foreground">Notes</span>
                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, notes: event.target.value }))
                  }
                  className="min-h-24 w-full rounded-lg border border-border bg-panel-soft px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Customer notes, layer-height assumptions, or delivery notes."
                />
              </label>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button onClick={calculateSummary} disabled={!selectedFilament}>
              Calculate Summary
            </Button>
            <Button
              variant="secondary"
              onClick={() => saveQuote(form.status)}
              disabled={saving || !selectedFilament || !calculatedBreakdown}
            >
              {saving
                ? "Saving..."
                : editingRecord?.kind === "quote"
                  ? "Update Quote"
                  : "Save Quote"}
            </Button>
            <Button
              variant="secondary"
              onClick={savePrint}
              disabled={saving || !selectedFilament || !calculatedBreakdown}
            >
              {editingRecord?.kind === "print" ? "Update Print" : "Save Print"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => saveQuote("Quoted")}
              disabled={saving || !selectedFilament || !calculatedBreakdown}
            >
              Save as Quoted
            </Button>
            {message ? <Badge variant="accent">{message}</Badge> : null}
          </div>
        </div>

        <QuoteSummaryPanel
          breakdown={calculatedBreakdown ?? breakdown}
          currency={settings.currency}
          locale={settings.locale}
          filamentSelected={Boolean(selectedFilament)}
          ready={Boolean(calculatedBreakdown)}
        />
      </div>
    </div>
  );
}

function recordToForm(record: QuoteRecord | PrintRecord): QuoteInput {
  return {
    customerName: record.customerName,
    jobName: record.jobName,
    quantity: record.quantity,
    filamentId: record.filamentId,
    gramsUsed: record.gramsUsed,
    wastePercent: record.wastePercent,
    printHours: record.printHours,
    machineRate: record.machineRate,
    powerDrawWatts: record.powerDrawWatts,
    electricityCostPerKwh: record.electricityCostPerKwh,
    laborMinutes: record.laborMinutes,
    laborRate: record.laborRate,
    profitMargin: record.profitMargin,
    minimumPriceFloor: record.minimumPriceFloor,
    bulkEnabled: record.bulkEnabled,
    tier2Qty: record.tier2Qty,
    tier2DiscountPercent: record.tier2DiscountPercent,
    notes: record.notes,
    status: "status" in record ? record.status : "Draft",
  };
}
