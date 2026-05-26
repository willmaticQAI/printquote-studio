"use client";

import { useState, type FormEvent } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FILAMENT_TYPES } from "@/lib/constants";
import type { FilamentRecord, FilamentType } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

type FilamentsManagerProps = {
  initialFilaments: FilamentRecord[];
  currency: string;
  locale: string;
};

type FilamentForm = {
  brand: string;
  material: FilamentType;
  colorName: string;
  colorHex: string;
  costPerKg: number;
  spoolWeightGrams: number;
  remainingGrams: number;
  notes: string;
};

const initialForm: FilamentForm = {
  brand: "",
  material: "PLA",
  colorName: "",
  colorHex: "#14b8a6",
  costPerKg: 0,
  spoolWeightGrams: 1000,
  remainingGrams: 1000,
  notes: "",
};

export function FilamentsManager({
  initialFilaments,
  currency,
  locale,
}: FilamentsManagerProps) {
  const [filaments, setFilaments] = useState(initialFilaments);
  const [form, setForm] = useState<FilamentForm>(initialForm);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const response = await fetch("/api/filaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const saved = (await response.json()) as FilamentRecord;
    setFilaments((current) => [saved, ...current]);
    setForm(initialForm);
    setSaving(false);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Filaments"
        description="Manage real spool profiles so the calculator can price jobs from saved material data."
        badge="Inventory"
        action={
          <Badge variant="accent">
            {filaments.length} {filaments.length === 1 ? "profile" : "profiles"}
          </Badge>
        }
      />

      <Card hover glow>
        <CardHeader>
          <CardTitle>Add Filament</CardTitle>
          <CardDescription>
            Profiles saved here appear immediately in the calculator.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <Input
              label="Brand"
              value={form.brand}
              onChange={(event) =>
                setForm((current) => ({ ...current, brand: event.target.value }))
              }
              required
            />
            <Input
              label="Color name"
              value={form.colorName}
              onChange={(event) =>
                setForm((current) => ({ ...current, colorName: event.target.value }))
              }
              required
            />
            <Select
              label="Material"
              value={form.material}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  material: event.target.value as FilamentType,
                }))
              }
            >
              {FILAMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
            <Input
              label="Color swatch"
              type="color"
              value={form.colorHex}
              onChange={(event) =>
                setForm((current) => ({ ...current, colorHex: event.target.value }))
              }
            />
            <Input
              label="Cost per kg"
              type="number"
              step="0.01"
              value={form.costPerKg}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  costPerKg: Number(event.target.value),
                }))
              }
              required
            />
            <Input
              label="Spool weight (g)"
              type="number"
              value={form.spoolWeightGrams}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  spoolWeightGrams: Number(event.target.value),
                }))
              }
              required
            />
            <Input
              label="Remaining grams"
              type="number"
              value={form.remainingGrams}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  remainingGrams: Number(event.target.value),
                }))
              }
              required
            />
            <label className="block space-y-1.5 sm:col-span-2">
              <span className="text-sm font-medium text-foreground">Notes</span>
              <textarea
                value={form.notes}
                onChange={(event) =>
                  setForm((current) => ({ ...current, notes: event.target.value }))
                }
                className="min-h-24 w-full rounded-lg border border-border bg-panel-soft px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Optional supplier notes, batch notes, or settings reminders."
              />
            </label>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Add Filament"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {filaments.length === 0 ? (
        <EmptyState
          title="No filament profiles yet"
          description="Add your first spool above to unlock calculator pricing and inventory tracking."
          icon={<span className="text-xl">+</span>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filaments.map((filament) => {
            const remainingPercent = Math.max(
              0,
              Math.min(100, (filament.remainingGrams / filament.spoolWeightGrams) * 100)
            );
            const lowStock = remainingPercent <= 20;

            return (
              <Card key={filament.id} hover glow={lowStock}>
                <CardHeader className="mb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-8 w-8 shrink-0 rounded-full border border-border"
                        style={{ backgroundColor: filament.colorHex }}
                        aria-hidden
                      />
                      <div>
                        <CardTitle className="text-sm leading-snug">
                          {filament.brand} {filament.material}
                        </CardTitle>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <Badge variant="accent">{filament.colorName}</Badge>
                          <Badge variant="outline">{filament.material}</Badge>
                        </div>
                      </div>
                    </div>
                    {lowStock ? <Badge variant="warning">Low</Badge> : null}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Cost / kg</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(filament.costPerKg, currency, locale)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Remaining</span>
                    <span className="font-medium text-foreground">
                      {filament.remainingGrams}g / {filament.spoolWeightGrams}g
                    </span>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-xs text-muted">
                      <span>Inventory</span>
                      <span>{remainingPercent.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-panel-soft">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          lowStock ? "bg-warning" : "bg-accent"
                        )}
                        style={{ width: `${remainingPercent}%` }}
                      />
                    </div>
                  </div>
                  {filament.notes ? (
                    <p className="text-xs text-muted">{filament.notes}</p>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
