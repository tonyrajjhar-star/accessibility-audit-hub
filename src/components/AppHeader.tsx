import { Link } from "@tanstack/react-router";
import logoUrl from "@/assets/validator-logo.png";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="group flex min-w-0 items-center gap-3.5" aria-label="Accessibility Validator — go to dashboard">
          <span className="gradient-primary relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl shadow-glow transition-transform duration-300 group-hover:scale-105">
            <img src={logoUrl} alt="" width={40} height={40} loading="lazy" className="size-10 object-contain drop-shadow-sm" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-2xl font-bold tracking-tight text-foreground">
              Accessibility <span className="text-gradient-primary">Validator</span>
            </span>
            <span className="hidden text-xs font-medium text-muted-foreground sm:block">
              Inclusive web, validated — WCAG · EN 301 549 · Section 508
            </span>
          </span>
        </Link>
        <span className="hidden items-center gap-2 rounded-full border border-success/25 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success md:inline-flex">
          <span className="size-2 animate-pulse rounded-full bg-success" />
          All systems scanning
        </span>
      </div>
    </header>
  );
}
