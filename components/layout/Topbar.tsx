import { Badge } from "@/components/ui/Badge";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { buttonStyles, cn } from "@/lib/utils";
import Link from "next/link";

type TopbarProps = {
  onMenuClick?: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-auto min-h-14 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border bg-panel/95 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-panel-soft text-muted transition-colors hover:border-accent/30 hover:text-foreground lg:hidden"
          )}
          aria-label="Toggle navigation"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-foreground">
            {APP_NAME}
          </h1>
          <p className="truncate text-xs text-muted">{APP_TAGLINE}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Badge variant="outline" className="hidden sm:inline-flex">
          <span
            className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-success"
            aria-hidden
          />
          Local Mode
        </Badge>
        <Link href="/calculator" className={buttonStyles("primary", "px-3 py-1.5 text-xs")}>
          New Quote
        </Link>
      </div>
    </header>
  );
}
