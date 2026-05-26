import type { FilamentType, QuoteStatus } from "@/lib/types";

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
    label: "Prints",
    href: "/prints",
    description: "Save completed prints and review historical job costs",
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
] satisfies FilamentType[];

export const QUOTE_STATUSES = [
  "Draft",
  "Quoted",
  "Accepted",
  "Completed",
] satisfies QuoteStatus[];
