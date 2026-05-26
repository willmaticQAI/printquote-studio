import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  AppData,
  FilamentRecord,
  QuoteRecord,
  SettingsRecord,
} from "@/lib/types";

const dataDirectory = path.join(process.cwd(), "data");
const dataFilePath = path.join(dataDirectory, "store.json");

const defaultSettings: SettingsRecord = {
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

const defaultData: AppData = {
  settings: defaultSettings,
  filaments: [],
  quotes: [],
  prints: [],
};

async function ensureDataFile() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await readFile(dataFilePath, "utf8");
  } catch {
    await writeFile(dataFilePath, JSON.stringify(defaultData, null, 2), "utf8");
  }
}

export async function readAppData(): Promise<AppData> {
  await ensureDataFile();

  const raw = await readFile(dataFilePath, "utf8");
  const parsed = JSON.parse(raw) as Partial<AppData>;

  return {
    settings: { ...defaultSettings, ...parsed.settings },
    filaments: Array.isArray(parsed.filaments)
      ? (parsed.filaments as FilamentRecord[])
      : [],
    quotes: Array.isArray(parsed.quotes) ? (parsed.quotes as QuoteRecord[]) : [],
    prints: Array.isArray(parsed.prints) ? parsed.prints : [],
  };
}

export async function writeAppData(data: AppData) {
  await ensureDataFile();
  await writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8");
}

export async function updateAppData(
  updater: (current: AppData) => AppData | Promise<AppData>
) {
  const current = await readAppData();
  const next = await updater(current);
  await writeAppData(next);
  return next;
}

export { defaultSettings };
