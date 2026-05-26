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
import { EmptyState } from "@/components/ui/EmptyState";
import { FILAMENT_TYPES, PLACEHOLDER_FILAMENTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function FilamentsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Filaments"
        description="Manage spool profiles—brand, material, cost per kg, and remaining weight—for accurate calculator pricing."
        badge="Inventory"
        action={
          <Button disabled title="Available in Phase 3">
            Add Filament
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLACEHOLDER_FILAMENTS.map((filament) => (
          <Card
            key={filament.name}
            hover
            glow={"lowStock" in filament && filament.lowStock}
          >
            <CardHeader className="mb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span
                    className="h-8 w-8 shrink-0 rounded-full border border-border"
                    style={{ backgroundColor: filament.color }}
                    aria-hidden
                  />
                  <div>
                    <CardTitle className="text-sm leading-snug">
                      {filament.name}
                    </CardTitle>
                    <Badge variant="accent" className="mt-1">
                      {filament.type}
                    </Badge>
                  </div>
                </div>
                {"lowStock" in filament && filament.lowStock ? (
                  <Badge variant="warning">Low</Badge>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Cost / kg</span>
                <span className="font-medium text-foreground">
                  {filament.costPerKg}
                </span>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span>Remaining</span>
                  <span>{filament.remaining}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-panel-soft">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      "lowStock" in filament && filament.lowStock
                        ? "bg-warning"
                        : "bg-accent"
                    )}
                    style={{ width: filament.remaining }}
                  />
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full" disabled>
                Edit profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supported material types</CardTitle>
          <CardDescription>
            Profiles you create can use any of these predefined types.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {FILAMENT_TYPES.map((type) => (
              <Badge key={type} variant="outline">
                {type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <EmptyState
        title="Add your first custom spool"
        description="When database persistence is enabled, new filament profiles will appear in the grid above and in the calculator dropdown."
        icon={<span className="text-xl">+</span>}
        action={
          <Button disabled variant="secondary">
            Add Filament
          </Button>
        }
      />
    </div>
  );
}
