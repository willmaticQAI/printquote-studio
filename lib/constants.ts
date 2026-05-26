export const APP_NAME = "PrintQuote Studio";
export const APP_CONSOLE_NAME = "PrintLab Command Console";
export const APP_TAGLINE = "Local-first 3D print quote manager";
export const APP_VERSION = "v0.1.0 — Local-first MVP";

export type NavItem = {
  label: string;
  href: string;
  description: string;
  icon?: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    description: "Overview of quotes, revenue, and inventory alerts",
  },
  {
    label: "Calculator",
    href: "/calculator",
    description: "Estimate print cost and customer price",
  },
  {
    label: "Filaments",
    href: "/filaments",
    description: "Manage material profiles and spool costs",
  },
  {
    label: "Quotes",
    href: "/quotes",
    description: "Save, review, and export customer quotes",
  },
  {
    label: "Settings",
    href: "/settings",
    description: "Configure defaults and shop preferences",
  },
];

export const FILAMENT_TYPES = [
  "PLA",
  "PLA+",
  "PETG",
  "ABS",
  "ASA",
  "TPU",
  "Nylon",
  "Polycarbonate",
  "HIPS",
  "PVA",
] as const;

export type FilamentType = (typeof FILAMENT_TYPES)[number];

export const QUOTE_STATUSES = [
  "Draft",
  "Quoted",
  "Accepted",
  "Completed",
] as const;

export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export const PLACEHOLDER_QUOTES = [
  {
    id: "Q-1042",
    customer: "Acme Robotics",
    job: "Bracket mount v2",
    total: "$48.50",
    margin: "32%",
    status: "Quoted" as QuoteStatus,
    date: "May 22, 2026",
  },
  {
    id: "Q-1041",
    customer: "Studio Nova",
    job: "Display stand prototype",
    total: "$124.00",
    margin: "28%",
    status: "Accepted" as QuoteStatus,
    date: "May 20, 2026",
  },
  {
    id: "Q-1040",
    customer: "—",
    job: "Phone dock shell",
    total: "$22.75",
    margin: "—",
    status: "Draft" as QuoteStatus,
    date: "May 18, 2026",
  },
  {
    id: "Q-1038",
    customer: "Maker Guild",
    job: "Batch of 12 clips",
    total: "$186.40",
    margin: "41%",
    status: "Completed" as QuoteStatus,
    date: "May 12, 2026",
  },
] as const;

export const PLACEHOLDER_FILAMENTS = [
  {
    name: "eSun PLA+ — Matte Black",
    type: "PLA+",
    costPerKg: "$18.99",
    remaining: "62%",
    color: "#1e293b",
  },
  {
    name: "Polymaker PETG — Clear",
    type: "PETG",
    costPerKg: "$24.50",
    remaining: "18%",
    color: "#38bdf8",
    lowStock: true,
  },
  {
    name: "Hatchbox ABS — White",
    type: "ABS",
    costPerKg: "$21.00",
    remaining: "45%",
    color: "#f8fafc",
  },
] as const;
