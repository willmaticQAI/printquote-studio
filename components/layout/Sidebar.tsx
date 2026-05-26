"use client";

import {
  APP_CONSOLE_NAME,
  APP_NAME,
  APP_VERSION,
  NAV_ITEMS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navIcons: Record<string, string> = {
  Dashboard: "◈",
  Calculator: "◎",
  Filaments: "◉",
  Quotes: "▤",
  Settings: "⚙",
};

type SidebarProps = {
  mobileOpen?: boolean;
  onNavigate?: () => void;
};

export function Sidebar({ mobileOpen = false, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-border bg-panel transition-transform duration-200 lg:static lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="border-b border-border px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-sm font-bold text-accent shadow-sm shadow-accent/10">
            PQ
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {APP_NAME}
            </p>
            <p className="truncate text-[10px] uppercase tracking-wider text-muted">
              {APP_CONSOLE_NAME}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-widest text-muted">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "border border-accent/20 bg-accent/10 text-accent shadow-sm shadow-accent/5"
                  : "border border-transparent text-muted hover:border-border hover:bg-panel-soft hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "text-base leading-none",
                  isActive ? "text-accent" : "text-muted group-hover:text-accent"
                )}
                aria-hidden
              >
                {navIcons[item.label] ?? "•"}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-lg border border-border bg-panel-soft px-3 py-2.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted">
            Status
          </p>
          <p className="mt-0.5 text-xs text-foreground">{APP_VERSION}</p>
        </div>
      </div>
    </aside>
  );
}
