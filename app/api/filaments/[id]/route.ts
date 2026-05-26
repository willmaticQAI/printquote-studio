import { deleteFilament, getFilament, updateFilament } from "@/lib/data-store";
import type { FilamentRecord } from "@/lib/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const filament = await getFilament(id);

  if (!filament) {
    return Response.json({ message: "Filament not found." }, { status: 404 });
  }

  return Response.json(filament);
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = (await request.json()) as Omit<
    FilamentRecord,
    "id" | "createdAt" | "updatedAt"
  >;

  try {
    const filament = await updateFilament(id, payload);
    return Response.json(filament);
  } catch {
    return Response.json({ message: "Filament not found." }, { status: 404 });
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    await deleteFilament(id);
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ message: "Filament not found." }, { status: 404 });
  }
}
