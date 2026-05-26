"use client";

import { useState, type FormEvent } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Select } from "@/components/ui/Select";
import type { SettingsRecord } from "@/lib/types";

type SettingsManagerProps = {
  initialSettings: SettingsRecord;
};

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    const next = (await response.json()) as SettingsRecord;
    setSettings(next);
    setSaving(false);
    setMessage("Settings saved.");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Settings"
        description="Configure the defaults your calculator uses for every new quote."
        badge="Live"
        action={
          <Button type="submit" form="settings-form" disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        }
      />

      <form id="settings-form" className="space-y-6" onSubmit={handleSubmit}>
        <Card hover glow>
          <CardHeader>
            <SectionHeader
              title="Pricing Defaults"
              description="Applied automatically when you start a new quote."
              badge="Persisted"
              badgeVariant="success"
            />
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Default profit %"
              type="number"
              value={settings.defaultProfitMargin}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  defaultProfitMargin: Number(event.target.value),
                }))
              }
            />
            <Input
              label="Default waste %"
              type="number"
              value={settings.defaultWastePercent}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  defaultWastePercent: Number(event.target.value),
                }))
              }
            />
            <Input
              label="Minimum price floor"
              type="number"
              value={settings.minimumPriceFloor}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  minimumPriceFloor: Number(event.target.value),
                }))
              }
              className="sm:col-span-2"
            />
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader>
            <SectionHeader
              title="Machine & Labor"
              description="Hourly and power assumptions used in every quote."
            />
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Machine rate ($/hr)"
              type="number"
              step="0.01"
              value={settings.machineRate}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  machineRate: Number(event.target.value),
                }))
              }
            />
            <Input
              label="Labor rate ($/hr)"
              type="number"
              step="0.01"
              value={settings.laborRate}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  laborRate: Number(event.target.value),
                }))
              }
            />
            <Input
              label="Electricity cost ($/kWh)"
              type="number"
              step="0.01"
              value={settings.electricityCostPerKwh}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  electricityCostPerKwh: Number(event.target.value),
                }))
              }
            />
            <Input
              label="Printer power draw (W)"
              type="number"
              value={settings.powerDrawWatts}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  powerDrawWatts: Number(event.target.value),
                }))
              }
            />
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader>
            <CardTitle>Rounding & Display</CardTitle>
            <CardDescription>
              Control how final prices are rounded before they are saved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Rounding mode"
              value={settings.roundingMode}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  roundingMode: event.target.value as SettingsRecord["roundingMode"],
                }))
              }
            >
              <option value="nearest-0.5">Nearest $0.50</option>
              <option value="up-1">Round up to $1</option>
              <option value="down-0.25">Round down to $0.25</option>
              <option value="none">No rounding</option>
            </Select>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Currency: {settings.currency}</Badge>
              <Badge variant="outline">Locale: {settings.locale}</Badge>
              {message ? <Badge variant="success">{message}</Badge> : null}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
