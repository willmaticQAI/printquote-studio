import { randomUUID } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { Prisma, QuoteStatus as PrismaQuoteStatus, RoundingMode as PrismaRoundingMode } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  buildPrintRecord,
  buildQuoteRecord,
  calculateQuoteBreakdown,
} from "@/lib/quote-calculations";
import type {
  AppData,
  FilamentRecord,
  PrintRecord,
  QuoteInput,
  QuoteRecord,
  QuoteStatus,
  RoundingMode,
  SettingsRecord,
} from "@/lib/types";

const legacyDataFilePath = path.join(process.cwd(), "data", "store.json");
const settingsId = "default";

const roundingModeToDb: Record<RoundingMode, PrismaRoundingMode> = {
  "nearest-0.5": "nearest_0_5",
  "up-1": "up_1",
  "down-0.25": "down_0_25",
  none: "none",
};

const roundingModeFromDb: Record<PrismaRoundingMode, RoundingMode> = {
  nearest_0_5: "nearest-0.5",
  up_1: "up-1",
  down_0_25: "down-0.25",
  none: "none",
};

export const defaultSettings: SettingsRecord = {
  defaultProfitMargin: 30,
  defaultWastePercent: 5,
  machineRate: 2.5,
  laborRate: 25,
  electricityCostPerKwh: 0.15,
  powerDrawWatts: 120,
  minimumPriceFloor: 0,
  roundingMode: "nearest-0.5",
  currency: "USD",
  locale: "en-US",
};

function breakdownColumns(breakdown: QuoteRecord["breakdown"] | PrintRecord["breakdown"]) {
  return {
    materialCost: breakdown.materialCost,
    wasteCost: breakdown.wasteCost,
    machineCost: breakdown.machineCost,
    electricityCost: breakdown.electricityCost,
    laborCost: breakdown.laborCost,
    subtotal: breakdown.subtotal,
    bulkDiscount: breakdown.bulkDiscount,
    suggestedPrice: breakdown.suggestedPrice,
    finalTotal: breakdown.finalTotal,
    profitAmount: breakdown.profitAmount,
    marginPercent: breakdown.marginPercent,
  };
}

function mapSettings(settings: {
  defaultProfitMargin: number;
  defaultWastePercent: number;
  machineRate: number;
  laborRate: number;
  electricityCostPerKwh: number;
  powerDrawWatts: number;
  minimumPriceFloor: number;
  roundingMode: PrismaRoundingMode;
  currency: string;
  locale: string;
}): SettingsRecord {
  return {
    defaultProfitMargin: settings.defaultProfitMargin,
    defaultWastePercent: settings.defaultWastePercent,
    machineRate: settings.machineRate,
    laborRate: settings.laborRate,
    electricityCostPerKwh: settings.electricityCostPerKwh,
    powerDrawWatts: settings.powerDrawWatts,
    minimumPriceFloor: settings.minimumPriceFloor,
    roundingMode: roundingModeFromDb[settings.roundingMode],
    currency: settings.currency,
    locale: settings.locale,
  };
}

function mapFilament(filament: Prisma.FilamentGetPayload<object>): FilamentRecord {
  return {
    id: filament.id,
    brand: filament.brand,
    material: filament.material as FilamentRecord["material"],
    colorName: filament.colorName,
    colorHex: filament.colorHex,
    costPerKg: filament.costPerKg,
    spoolWeightGrams: filament.spoolWeightGrams,
    remainingGrams: filament.remainingGrams,
    notes: filament.notes,
    createdAt: filament.createdAt.toISOString(),
    updatedAt: filament.updatedAt.toISOString(),
  };
}

function mapQuote(quote: Prisma.QuoteGetPayload<object>): QuoteRecord {
  return {
    id: quote.id,
    quoteNumber: quote.quoteNumber,
    customerName: quote.customerName,
    jobName: quote.jobName,
    quantity: quote.quantity,
    filamentId: quote.filamentId,
    filamentLabel: quote.filamentLabel,
    gramsUsed: quote.gramsUsed,
    wastePercent: quote.wastePercent,
    printHours: quote.printHours,
    machineRate: quote.machineRate,
    powerDrawWatts: quote.powerDrawWatts,
    electricityCostPerKwh: quote.electricityCostPerKwh,
    laborMinutes: quote.laborMinutes,
    laborRate: quote.laborRate,
    profitMargin: quote.profitMargin,
    minimumPriceFloor: quote.minimumPriceFloor,
    bulkEnabled: quote.bulkEnabled,
    tier2Qty: quote.tier2Qty,
    tier2DiscountPercent: quote.tier2DiscountPercent,
    notes: quote.notes,
    status: quote.status as QuoteStatus,
    createdAt: quote.createdAt.toISOString(),
    updatedAt: quote.updatedAt.toISOString(),
    breakdown: {
      materialCost: quote.materialCost,
      wasteCost: quote.wasteCost,
      machineCost: quote.machineCost,
      electricityCost: quote.electricityCost,
      laborCost: quote.laborCost,
      subtotal: quote.subtotal,
      bulkDiscount: quote.bulkDiscount,
      suggestedPrice: quote.suggestedPrice,
      finalTotal: quote.finalTotal,
      profitAmount: quote.profitAmount,
      marginPercent: quote.marginPercent,
    },
  };
}

function mapPrint(print: Prisma.PrintJobGetPayload<object>): PrintRecord {
  return {
    id: print.id,
    printNumber: print.printNumber,
    customerName: print.customerName,
    jobName: print.jobName,
    quantity: print.quantity,
    filamentId: print.filamentId,
    filamentLabel: print.filamentLabel,
    gramsUsed: print.gramsUsed,
    wastePercent: print.wastePercent,
    printHours: print.printHours,
    machineRate: print.machineRate,
    powerDrawWatts: print.powerDrawWatts,
    electricityCostPerKwh: print.electricityCostPerKwh,
    laborMinutes: print.laborMinutes,
    laborRate: print.laborRate,
    profitMargin: print.profitMargin,
    minimumPriceFloor: print.minimumPriceFloor,
    bulkEnabled: print.bulkEnabled,
    tier2Qty: print.tier2Qty,
    tier2DiscountPercent: print.tier2DiscountPercent,
    notes: print.notes,
    createdAt: print.createdAt.toISOString(),
    updatedAt: print.updatedAt.toISOString(),
    breakdown: {
      materialCost: print.materialCost,
      wasteCost: print.wasteCost,
      machineCost: print.machineCost,
      electricityCost: print.electricityCost,
      laborCost: print.laborCost,
      subtotal: print.subtotal,
      bulkDiscount: print.bulkDiscount,
      suggestedPrice: print.suggestedPrice,
      finalTotal: print.finalTotal,
      profitAmount: print.profitAmount,
      marginPercent: print.marginPercent,
    },
  };
}

async function readLegacyAppData(): Promise<AppData | null> {
  try {
    await access(legacyDataFilePath);
  } catch {
    return null;
  }

  const raw = await readFile(legacyDataFilePath, "utf8");
  return JSON.parse(raw) as AppData;
}

async function seedFromLegacyData(data: AppData) {
  await prisma.settings.upsert({
    where: { id: settingsId },
    update: {
      ...data.settings,
      roundingMode: roundingModeToDb[data.settings.roundingMode],
    },
    create: {
      id: settingsId,
      ...data.settings,
      roundingMode: roundingModeToDb[data.settings.roundingMode],
    },
  });

  if (data.filaments.length > 0) {
    await prisma.filament.createMany({
      data: data.filaments.map((filament) => ({
        ...filament,
        createdAt: new Date(filament.createdAt),
        updatedAt: new Date(filament.updatedAt),
      })),
    });
  }

  if (data.quotes.length > 0) {
    await prisma.quote.createMany({
      data: data.quotes.map((quote) => ({
        id: quote.id,
        quoteNumber: quote.quoteNumber,
        customerName: quote.customerName,
        jobName: quote.jobName,
        quantity: quote.quantity,
        filamentId: quote.filamentId,
        filamentLabel: quote.filamentLabel,
        gramsUsed: quote.gramsUsed,
        wastePercent: quote.wastePercent,
        printHours: quote.printHours,
        machineRate: quote.machineRate,
        powerDrawWatts: quote.powerDrawWatts,
        electricityCostPerKwh: quote.electricityCostPerKwh,
        laborMinutes: quote.laborMinutes,
        laborRate: quote.laborRate,
        profitMargin: quote.profitMargin,
        minimumPriceFloor: quote.minimumPriceFloor,
        bulkEnabled: quote.bulkEnabled,
        tier2Qty: quote.tier2Qty,
        tier2DiscountPercent: quote.tier2DiscountPercent,
        notes: quote.notes,
        status: quote.status as PrismaQuoteStatus,
        ...breakdownColumns(quote.breakdown),
        createdAt: new Date(quote.createdAt),
        updatedAt: new Date(quote.updatedAt),
      })),
    });
  }

  if (data.prints.length > 0) {
    await prisma.printJob.createMany({
      data: data.prints.map((print) => ({
        id: print.id,
        printNumber: print.printNumber,
        customerName: print.customerName,
        jobName: print.jobName,
        quantity: print.quantity,
        filamentId: print.filamentId,
        filamentLabel: print.filamentLabel,
        gramsUsed: print.gramsUsed,
        wastePercent: print.wastePercent,
        printHours: print.printHours,
        machineRate: print.machineRate,
        powerDrawWatts: print.powerDrawWatts,
        electricityCostPerKwh: print.electricityCostPerKwh,
        laborMinutes: print.laborMinutes,
        laborRate: print.laborRate,
        profitMargin: print.profitMargin,
        minimumPriceFloor: print.minimumPriceFloor,
        bulkEnabled: print.bulkEnabled,
        tier2Qty: print.tier2Qty,
        tier2DiscountPercent: print.tier2DiscountPercent,
        notes: print.notes,
        ...breakdownColumns(print.breakdown),
        createdAt: new Date(print.createdAt),
        updatedAt: new Date(print.updatedAt),
      })),
    });
  }
}

export async function ensureDatabaseBootstrapped() {
  const settings = await prisma.settings.findUnique({ where: { id: settingsId } });
  if (settings) return;

  const legacy = await readLegacyAppData();
  if (legacy) {
    await seedFromLegacyData(legacy);
    return;
  }

  await prisma.settings.create({
    data: {
      id: settingsId,
      ...defaultSettings,
      roundingMode: roundingModeToDb[defaultSettings.roundingMode],
    },
  });
}

export async function readAppData(): Promise<AppData> {
  await ensureDatabaseBootstrapped();

  const [settings, filaments, quotes, prints] = await Promise.all([
    prisma.settings.findUniqueOrThrow({ where: { id: settingsId } }),
    prisma.filament.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.quote.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.printJob.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return {
    settings: mapSettings(settings),
    filaments: filaments.map(mapFilament),
    quotes: quotes.map(mapQuote),
    prints: prints.map(mapPrint),
  };
}

export async function getSettings() {
  await ensureDatabaseBootstrapped();
  const settings = await prisma.settings.findUniqueOrThrow({ where: { id: settingsId } });
  return mapSettings(settings);
}

export async function updateSettings(payload: Partial<SettingsRecord>) {
  await ensureDatabaseBootstrapped();
  const { roundingMode, ...rest } = payload;
  const updated = await prisma.settings.update({
    where: { id: settingsId },
    data: {
      ...rest,
      ...(roundingMode ? { roundingMode: roundingModeToDb[roundingMode] } : {}),
    },
  });
  return mapSettings(updated);
}

export type FilamentWriteInput = Omit<
  FilamentRecord,
  "id" | "createdAt" | "updatedAt"
>;

export async function listFilaments() {
  await ensureDatabaseBootstrapped();
  const filaments = await prisma.filament.findMany({ orderBy: { createdAt: "desc" } });
  return filaments.map(mapFilament);
}

export async function getFilament(id: string) {
  await ensureDatabaseBootstrapped();
  const filament = await prisma.filament.findUnique({ where: { id } });
  return filament ? mapFilament(filament) : null;
}

export async function createFilament(payload: FilamentWriteInput) {
  await ensureDatabaseBootstrapped();
  const now = new Date();
  const filament = await prisma.filament.create({
    data: {
      id: randomUUID(),
      ...payload,
      createdAt: now,
      updatedAt: now,
    },
  });
  return mapFilament(filament);
}

export async function updateFilament(id: string, payload: FilamentWriteInput) {
  await ensureDatabaseBootstrapped();
  const filament = await prisma.filament.update({
    where: { id },
    data: {
      ...payload,
      updatedAt: new Date(),
    },
  });
  return mapFilament(filament);
}

export async function deleteFilament(id: string) {
  await ensureDatabaseBootstrapped();
  await prisma.filament.delete({ where: { id } });
}

function extractNextNumber(prefix: string, values: string[]) {
  const highest = values.reduce((max, value) => {
    const numeric = Number.parseInt(value.replace(prefix, ""), 10);
    return Number.isNaN(numeric) ? max : Math.max(max, numeric);
  }, 1000);
  return `${prefix}${highest + 1}`;
}

async function resolveFilamentForJob(filamentId: string) {
  const filament = await prisma.filament.findUnique({ where: { id: filamentId } });
  if (!filament) {
    throw new Error("Selected filament profile was not found.");
  }
  return mapFilament(filament);
}

export async function listQuotes() {
  await ensureDatabaseBootstrapped();
  const quotes = await prisma.quote.findMany({ orderBy: { createdAt: "desc" } });
  return quotes.map(mapQuote);
}

export async function getQuote(id: string) {
  await ensureDatabaseBootstrapped();
  const quote = await prisma.quote.findUnique({ where: { id } });
  return quote ? mapQuote(quote) : null;
}

export async function createQuote(input: QuoteInput) {
  await ensureDatabaseBootstrapped();
  const [settings, filament, quoteNumbers] = await Promise.all([
    getSettings(),
    resolveFilamentForJob(input.filamentId),
    prisma.quote.findMany({ select: { quoteNumber: true } }),
  ]);

  const record = buildQuoteRecord(
    input,
    filament,
    settings,
    quoteNumbers.map((quote) => ({
      id: "",
      quoteNumber: quote.quoteNumber,
      customerName: "",
      jobName: "",
      quantity: 0,
      filamentId: "",
      filamentLabel: "",
      gramsUsed: 0,
      wastePercent: 0,
      printHours: 0,
      machineRate: 0,
      powerDrawWatts: 0,
      electricityCostPerKwh: 0,
      laborMinutes: 0,
      laborRate: 0,
      profitMargin: 0,
      minimumPriceFloor: 0,
      bulkEnabled: false,
      tier2Qty: 0,
      tier2DiscountPercent: 0,
      notes: "",
      status: "Draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      breakdown: calculateQuoteBreakdown(input, filament, settings),
    }))
  );

  const quote = await prisma.quote.create({
    data: {
      id: record.id,
      quoteNumber: record.quoteNumber,
      customerName: record.customerName,
      jobName: record.jobName,
      quantity: record.quantity,
      filamentId: record.filamentId,
      filamentLabel: record.filamentLabel,
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
      status: record.status as PrismaQuoteStatus,
      ...breakdownColumns(record.breakdown),
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    },
  });

  return mapQuote(quote);
}

export async function updateQuote(id: string, input: QuoteInput) {
  await ensureDatabaseBootstrapped();
  const existing = await prisma.quote.findUnique({ where: { id } });
  if (!existing) return null;

  const [settings, filament] = await Promise.all([
    getSettings(),
    resolveFilamentForJob(input.filamentId),
  ]);

  const breakdown = calculateQuoteBreakdown(input, filament, settings);

  const quote = await prisma.quote.update({
    where: { id },
    data: {
      customerName: input.customerName.trim(),
      jobName: input.jobName.trim(),
      quantity: input.quantity,
      filamentId: filament.id,
      filamentLabel: `${filament.brand} ${filament.material} - ${filament.colorName}`,
      gramsUsed: input.gramsUsed,
      wastePercent: input.wastePercent,
      printHours: input.printHours,
      machineRate: input.machineRate,
      powerDrawWatts: input.powerDrawWatts,
      electricityCostPerKwh: input.electricityCostPerKwh,
      laborMinutes: input.laborMinutes,
      laborRate: input.laborRate,
      profitMargin: input.profitMargin,
      minimumPriceFloor: input.minimumPriceFloor,
      bulkEnabled: input.bulkEnabled,
      tier2Qty: input.tier2Qty,
      tier2DiscountPercent: input.tier2DiscountPercent,
      notes: input.notes.trim(),
      status: input.status as PrismaQuoteStatus,
      ...breakdownColumns(breakdown),
      updatedAt: new Date(),
    },
  });

  return mapQuote(quote);
}

export async function updateQuoteStatus(id: string, status: QuoteStatus) {
  await ensureDatabaseBootstrapped();
  const quote = await prisma.quote.update({
    where: { id },
    data: {
      status: status as PrismaQuoteStatus,
      updatedAt: new Date(),
    },
  });
  return mapQuote(quote);
}

export async function deleteQuote(id: string) {
  await ensureDatabaseBootstrapped();
  await prisma.quote.delete({ where: { id } });
}

export async function listPrints() {
  await ensureDatabaseBootstrapped();
  const prints = await prisma.printJob.findMany({ orderBy: { createdAt: "desc" } });
  return prints.map(mapPrint);
}

export async function getPrint(id: string) {
  await ensureDatabaseBootstrapped();
  const print = await prisma.printJob.findUnique({ where: { id } });
  return print ? mapPrint(print) : null;
}

export async function createPrint(input: QuoteInput) {
  await ensureDatabaseBootstrapped();
  const [settings, filament, printNumbers] = await Promise.all([
    getSettings(),
    resolveFilamentForJob(input.filamentId),
    prisma.printJob.findMany({ select: { printNumber: true } }),
  ]);

  const record = buildPrintRecord(
    input,
    filament,
    settings,
    printNumbers.map((print) => ({
      id: "",
      printNumber: print.printNumber,
      customerName: "",
      jobName: "",
      quantity: 0,
      filamentId: "",
      filamentLabel: "",
      gramsUsed: 0,
      wastePercent: 0,
      printHours: 0,
      machineRate: 0,
      powerDrawWatts: 0,
      electricityCostPerKwh: 0,
      laborMinutes: 0,
      laborRate: 0,
      profitMargin: 0,
      minimumPriceFloor: 0,
      bulkEnabled: false,
      tier2Qty: 0,
      tier2DiscountPercent: 0,
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      breakdown: calculateQuoteBreakdown(input, filament, settings),
    }))
  );

  const print = await prisma.printJob.create({
    data: {
      id: record.id,
      printNumber: record.printNumber,
      customerName: record.customerName,
      jobName: record.jobName,
      quantity: record.quantity,
      filamentId: record.filamentId,
      filamentLabel: record.filamentLabel,
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
      ...breakdownColumns(record.breakdown),
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    },
  });

  return mapPrint(print);
}

export async function updatePrint(id: string, input: QuoteInput) {
  await ensureDatabaseBootstrapped();
  const existing = await prisma.printJob.findUnique({ where: { id } });
  if (!existing) return null;

  const [settings, filament] = await Promise.all([
    getSettings(),
    resolveFilamentForJob(input.filamentId),
  ]);

  const breakdown = calculateQuoteBreakdown(input, filament, settings);

  const print = await prisma.printJob.update({
    where: { id },
    data: {
      customerName: input.customerName.trim(),
      jobName: input.jobName.trim(),
      quantity: input.quantity,
      filamentId: filament.id,
      filamentLabel: `${filament.brand} ${filament.material} - ${filament.colorName}`,
      gramsUsed: input.gramsUsed,
      wastePercent: input.wastePercent,
      printHours: input.printHours,
      machineRate: input.machineRate,
      powerDrawWatts: input.powerDrawWatts,
      electricityCostPerKwh: input.electricityCostPerKwh,
      laborMinutes: input.laborMinutes,
      laborRate: input.laborRate,
      profitMargin: input.profitMargin,
      minimumPriceFloor: input.minimumPriceFloor,
      bulkEnabled: input.bulkEnabled,
      tier2Qty: input.tier2Qty,
      tier2DiscountPercent: input.tier2DiscountPercent,
      notes: input.notes.trim(),
      ...breakdownColumns(breakdown),
      updatedAt: new Date(),
    },
  });

  return mapPrint(print);
}

export async function deletePrint(id: string) {
  await ensureDatabaseBootstrapped();
  await prisma.printJob.delete({ where: { id } });
}
