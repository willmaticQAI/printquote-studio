import { randomUUID } from "node:crypto";
import type {
  FilamentRecord,
  PrintRecord,
  QuoteBreakdown,
  QuoteInput,
  QuoteRecord,
  RoundingMode,
  SettingsRecord,
} from "@/lib/types";

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function applyRounding(value: number, mode: RoundingMode) {
  if (mode === "none") return roundCurrency(value);
  if (mode === "nearest-0.5") return Math.round(value * 2) / 2;
  if (mode === "up-1") return Math.ceil(value);
  return Math.floor(value * 4) / 4;
}

export function calculateQuoteBreakdown(
  input: QuoteInput,
  filament: FilamentRecord,
  settings: SettingsRecord
): QuoteBreakdown {
  const materialCost =
    (input.gramsUsed * input.quantity * filament.costPerKg) / 1000;
  const wasteCost = materialCost * (input.wastePercent / 100);
  const machineCost = input.printHours * input.machineRate;
  const electricityCost =
    (input.printHours * input.powerDrawWatts) / 1000 * input.electricityCostPerKwh;
  const laborCost = (input.laborMinutes / 60) * input.laborRate;
  const subtotal = materialCost + wasteCost + machineCost + electricityCost + laborCost;
  const suggestedPrice = subtotal * (1 + input.profitMargin / 100);
  const bulkDiscount =
    input.bulkEnabled && input.quantity >= input.tier2Qty
      ? suggestedPrice * (input.tier2DiscountPercent / 100)
      : 0;
  const priceAfterDiscount = suggestedPrice - bulkDiscount;
  const roundedTotal = applyRounding(
    Math.max(input.minimumPriceFloor, priceAfterDiscount),
    settings.roundingMode
  );
  const profitAmount = roundedTotal - subtotal;
  const marginPercent = roundedTotal > 0 ? (profitAmount / roundedTotal) * 100 : 0;

  return {
    materialCost: roundCurrency(materialCost),
    wasteCost: roundCurrency(wasteCost),
    machineCost: roundCurrency(machineCost),
    electricityCost: roundCurrency(electricityCost),
    laborCost: roundCurrency(laborCost),
    subtotal: roundCurrency(subtotal),
    bulkDiscount: roundCurrency(bulkDiscount),
    suggestedPrice: roundCurrency(suggestedPrice),
    finalTotal: roundCurrency(roundedTotal),
    profitAmount: roundCurrency(profitAmount),
    marginPercent: roundCurrency(marginPercent),
  };
}

function nextQuoteNumber(existingQuotes: QuoteRecord[]) {
  const highest = existingQuotes.reduce((max, quote) => {
    const numeric = Number.parseInt(quote.quoteNumber.replace("Q-", ""), 10);
    return Number.isNaN(numeric) ? max : Math.max(max, numeric);
  }, 1000);

  return `Q-${highest + 1}`;
}

function nextPrintNumber(existingPrints: PrintRecord[]) {
  const highest = existingPrints.reduce((max, print) => {
    const numeric = Number.parseInt(print.printNumber.replace("P-", ""), 10);
    return Number.isNaN(numeric) ? max : Math.max(max, numeric);
  }, 1000);

  return `P-${highest + 1}`;
}

export function buildQuoteRecord(
  input: QuoteInput,
  filament: FilamentRecord,
  settings: SettingsRecord,
  existingQuotes: QuoteRecord[]
): QuoteRecord {
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    quoteNumber: nextQuoteNumber(existingQuotes),
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
    status: input.status,
    createdAt: now,
    updatedAt: now,
    breakdown: calculateQuoteBreakdown(input, filament, settings),
  };
}

export function buildPrintRecord(
  input: QuoteInput,
  filament: FilamentRecord,
  settings: SettingsRecord,
  existingPrints: PrintRecord[]
): PrintRecord {
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    printNumber: nextPrintNumber(existingPrints),
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
    createdAt: now,
    updatedAt: now,
    breakdown: calculateQuoteBreakdown(input, filament, settings),
  };
}

export function buildDefaultQuoteInput(
  settings: SettingsRecord,
  fallbackFilamentId = ""
): QuoteInput {
  return {
    customerName: "",
    jobName: "",
    quantity: 1,
    filamentId: fallbackFilamentId,
    gramsUsed: 0,
    wastePercent: settings.defaultWastePercent,
    printHours: 0,
    machineRate: settings.machineRate,
    powerDrawWatts: settings.powerDrawWatts,
    electricityCostPerKwh: settings.electricityCostPerKwh,
    laborMinutes: 0,
    laborRate: settings.laborRate,
    profitMargin: settings.defaultProfitMargin,
    minimumPriceFloor: settings.minimumPriceFloor,
    bulkEnabled: false,
    tier2Qty: 10,
    tier2DiscountPercent: 5,
    notes: "",
    status: "Draft",
  };
}
