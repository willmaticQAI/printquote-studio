export type RoundingMode = "nearest-0.5" | "up-1" | "down-0.25" | "none";

export type QuoteStatus = "Draft" | "Quoted" | "Accepted" | "Completed";

export type FilamentType =
  | "PLA"
  | "PLA+"
  | "PETG"
  | "ABS"
  | "ASA"
  | "TPU"
  | "Nylon"
  | "Polycarbonate"
  | "HIPS"
  | "PVA";

export type SettingsRecord = {
  defaultProfitMargin: number;
  defaultWastePercent: number;
  machineRate: number;
  laborRate: number;
  electricityCostPerKwh: number;
  powerDrawWatts: number;
  minimumPriceFloor: number;
  roundingMode: RoundingMode;
  currency: string;
  locale: string;
};

export type FilamentRecord = {
  id: string;
  brand: string;
  material: FilamentType;
  colorName: string;
  colorHex: string;
  costPerKg: number;
  spoolWeightGrams: number;
  remainingGrams: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type QuoteBreakdown = {
  materialCost: number;
  wasteCost: number;
  machineCost: number;
  electricityCost: number;
  laborCost: number;
  subtotal: number;
  bulkDiscount: number;
  suggestedPrice: number;
  finalTotal: number;
  profitAmount: number;
  marginPercent: number;
};

export type QuoteRecord = {
  id: string;
  quoteNumber: string;
  customerName: string;
  jobName: string;
  quantity: number;
  filamentId: string;
  filamentLabel: string;
  gramsUsed: number;
  wastePercent: number;
  printHours: number;
  machineRate: number;
  powerDrawWatts: number;
  electricityCostPerKwh: number;
  laborMinutes: number;
  laborRate: number;
  profitMargin: number;
  minimumPriceFloor: number;
  bulkEnabled: boolean;
  tier2Qty: number;
  tier2DiscountPercent: number;
  notes: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
  breakdown: QuoteBreakdown;
};

export type PrintRecord = {
  id: string;
  printNumber: string;
  customerName: string;
  jobName: string;
  quantity: number;
  filamentId: string;
  filamentLabel: string;
  gramsUsed: number;
  wastePercent: number;
  printHours: number;
  machineRate: number;
  powerDrawWatts: number;
  electricityCostPerKwh: number;
  laborMinutes: number;
  laborRate: number;
  profitMargin: number;
  minimumPriceFloor: number;
  bulkEnabled: boolean;
  tier2Qty: number;
  tier2DiscountPercent: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  breakdown: QuoteBreakdown;
};

export type AppData = {
  settings: SettingsRecord;
  filaments: FilamentRecord[];
  quotes: QuoteRecord[];
  prints: PrintRecord[];
};

export type QuoteInput = {
  customerName: string;
  jobName: string;
  quantity: number;
  filamentId: string;
  gramsUsed: number;
  wastePercent: number;
  printHours: number;
  machineRate: number;
  powerDrawWatts: number;
  electricityCostPerKwh: number;
  laborMinutes: number;
  laborRate: number;
  profitMargin: number;
  minimumPriceFloor: number;
  bulkEnabled: boolean;
  tier2Qty: number;
  tier2DiscountPercent: number;
  notes: string;
  status: QuoteStatus;
};
