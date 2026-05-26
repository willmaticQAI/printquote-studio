import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Select } from "@/components/ui/Select";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Settings"
        description="Configure shop defaults used by the calculator—profit, waste, machine and labor rates, and rounding."
        badge="Preview"
        badgeVariant="outline"
        action={
          <Button disabled>Save Settings</Button>
        }
      />

      <Card hover glow>
        <CardHeader>
          <SectionHeader
            title="Pricing Defaults"
            description="Applied automatically when starting a new quote."
            badge="Not persisted"
            badgeVariant="warning"
          />
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Default profit %"
            type="number"
            placeholder="30"
            defaultValue="30"
            disabled
            hint="Target markup on break-even cost"
          />
          <Input
            label="Default waste %"
            type="number"
            placeholder="5"
            defaultValue="5"
            disabled
            hint="Material waste allowance"
          />
        </CardContent>
      </Card>

      <Card hover>
        <CardHeader>
          <SectionHeader
            title="Machine & Labor"
            description="Hourly rates for machine time and post-processing."
          />
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Default machine hourly rate ($)"
            type="number"
            placeholder="2.50"
            defaultValue="2.50"
            disabled
          />
          <Input
            label="Default labor rate ($/hr)"
            type="number"
            placeholder="25"
            defaultValue="25"
            disabled
          />
          <Input
            label="Electricity cost ($/kWh)"
            type="number"
            placeholder="0.15"
            defaultValue="0.15"
            disabled
            className="sm:col-span-2"
          />
        </CardContent>
      </Card>

      <Card hover>
        <CardHeader>
          <CardTitle>Rounding & Display</CardTitle>
          <CardDescription>
            How final customer prices are rounded before export.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select label="Rounding mode" disabled defaultValue="nearest">
            <option value="nearest">Nearest $0.50</option>
            <option value="up">Round up to $1</option>
            <option value="down">Round down to $0.25</option>
            <option value="none">No rounding</option>
          </Select>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Currency: USD</Badge>
            <Badge variant="outline">Locale: en-US</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>PrintQuote Studio local instance.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted">
          <p>
            Settings persistence and API sync are planned for Phase 3. All
            fields above are visual placeholders for Phase 1.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
