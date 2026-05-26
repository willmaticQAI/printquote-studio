"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { cn } from "@/lib/utils";
import { useState } from "react";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-full bg-background">
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <Sidebar
        mobileOpen={sidebarOpen}
        onNavigate={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setSidebarOpen((open) => !open)} />
        <main
          className={cn(
            "flex-1 overflow-auto p-4 sm:p-6 lg:p-8",
            "bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--accent)_6%,transparent)_0%,transparent_50%)]"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
