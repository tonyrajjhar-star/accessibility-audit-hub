import { useEffect, useRef, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowLeft,
  FolderOpen,
  RefreshCw,
  BarChart3,
  ListChecks,
  ClipboardCheck,
  FileText,
} from "lucide-react";
import { DefectSummaryPanel } from "@/components/DefectSummaryPanel";
import { ManualVerificationPanel } from "@/components/ManualVerificationPanel";
import { ComplianceReportPanel } from "@/components/ComplianceReportPanel";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/new-audit")({
  head: () => ({
    meta: [
      { title: "New Audit — Accessibility Validator" },
      { name: "description", content: "Configure and launch an accessibility audit, then review defects, manual verifications and the compliance report." },
      { property: "og:title", content: "New Audit — Accessibility Validator" },
      { property: "og:description", content: "Configure and launch an accessibility audit, then review defects, manual verifications and the compliance report." },
    ],
  }),
  component: NewAudit,
});

const resultTabs = [
  { key: "defects", label: "Defect Summary", icon: ListChecks },
  { key: "manual", label: "Manual Verification", icon: ClipboardCheck },
  { key: "report", label: "Compliance Report", icon: FileText },
] as const;

type TabKey = (typeof resultTabs)[number]["key"];

const standardOptions = [
  "WCAG 2.1 AA",
  "WCAG 2.2 AA",
  "EN 301 549",
  "Section 508",
  "ARIA Practices",
] as const;

function NewAudit() {
  const [url, setUrl] = useState("https://www.example.com");
  const [forceRefresh, setForceRefresh] = useState(true);
  const [scope, setScope] = useState<"full" | "selected" | "single">("full");
  const [selectedStandards, setSelectedStandards] = useState<string[]>(["WCAG 2.1 AA", "EN 301 549"]);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState<TabKey>("defects");
  const timer = useRef<number | null>(null);

  const toggleStandard = (s: string) => {
    setSelectedStandards((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };


  useEffect(() => () => {
    if (timer.current) window.clearInterval(timer.current);
  }, []);

  const runAudit = () => {
    if (running) return;
    if (!url.trim()) {
      toast.error("Enter a website URL to scan first.");
      return;
    }
    setRunning(true);
    setProgress(0);
    timer.current = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 4 + Math.random() * 6, 100);
        if (next >= 100) {
          if (timer.current) window.clearInterval(timer.current);
          setRunning(false);
          toast.success("Audit complete — open a results tab below to view the page.");
        }
        return next;
      });
    }, 140);
  };

  const stage = progress === 0 ? "Not started — run the audit to see live progress" : running ? "Scanning pages and checking rules…" : "Audit complete — results are ready below";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">New Audit</h1>
          <p className="mt-1 text-muted-foreground">Configure and launch an accessibility audit</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/15"
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>
      </div>

      {/* Steps */}
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <section className="card-surface p-5">
          <div className="flex items-center gap-3">
            <span className="gradient-primary grid size-9 place-items-center rounded-full font-display text-base font-bold text-primary-foreground shadow-glow">1</span>
            <h2 className="text-lg font-bold">Target</h2>
          </div>
          <label className="mt-4 block">
            <span className="text-sm font-semibold">Website URL</span>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.example.com"
              className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-soft outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <button
            onClick={() => toast.info("Project folder scanning — no ZIP upload required.")}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <FolderOpen className="size-4" /> Or scan a project folder — no ZIP upload required
          </button>
          <label className="mt-4 flex cursor-pointer items-start gap-3">
            <button
              role="switch"
              aria-checked={forceRefresh}
              onClick={() => setForceRefresh((v) => !v)}
              className={cn(
                "mt-0.5 h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors",
                forceRefresh ? "bg-primary" : "bg-muted-foreground/30",
              )}
            >
              <span className={cn("block size-5 rounded-full bg-white shadow transition-transform", forceRefresh && "translate-x-5")} />
            </button>
            <span className="text-sm font-medium">Force Refresh Audit — re-run from the beginning</span>
          </label>
        </section>

        <section className="card-surface p-5">
          <div className="flex items-center gap-3">
            <span className="gradient-primary grid size-9 place-items-center rounded-full font-display text-base font-bold text-primary-foreground shadow-glow">2</span>
            <h2 className="text-lg font-bold">Standards</h2>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Select the accessibility standards to check against</p>
          <select className="mt-3 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm font-medium shadow-soft outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
            <option>WCAG 2.1 AA, EN 301 549 +2 more</option>
            <option>WCAG 2.1 AA</option>
            <option>WCAG 2.2 AA</option>
            <option>EN 301 549</option>
            <option>Section 508</option>
            <option>ARIA Practices</option>
          </select>
          <p className="mt-3 text-sm text-muted-foreground">
            Choose one or more standards — WCAG 2.1 A/AA, EN 301 549, ARIA Practices, Section 508
          </p>
        </section>

        <section className="card-surface p-5">
          <div className="flex items-center gap-3">
            <span className="gradient-primary grid size-9 place-items-center rounded-full font-display text-base font-bold text-primary-foreground shadow-glow">3</span>
            <h2 className="text-lg font-bold">Scan Scope</h2>
          </div>
          <div className="mt-4 space-y-3">
            {(
              [
                { key: "full", label: "Full site — scan all accessible pages" },
                { key: "selected", label: "Selected pages — choose specific pages" },
                { key: "single", label: "Single page — scan one page only" },
              ] as const
            ).map((o) => (
              <label key={o.key} className="flex cursor-pointer items-start gap-3">
                <input
                  type="radio"
                  name="scope"
                  checked={scope === o.key}
                  onChange={() => setScope(o.key)}
                  className="mt-1 size-4 accent-[var(--color-primary)]"
                />
                <span className="text-sm font-medium">{o.label}</span>
              </label>
            ))}
          </div>
        </section>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <Link
          to="/"
          className="rounded-xl border border-input bg-card px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
        >
          Cancel
        </Link>
        <button
          onClick={runAudit}
          disabled={running}
          className="gradient-primary rounded-xl px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-60"
        >
          {running ? "Running…" : "Run Audit"}
        </button>
      </div>

      {/* Progress */}
      <section className="card-surface mt-6 p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
            <BarChart3 className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold">Audit Progress</h2>
            <p className="text-sm text-muted-foreground">{stage}</p>
          </div>
          <span className="ml-auto text-lg font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="gradient-primary h-full rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      {/* Results tabs */}
      <section className="mt-8">
        <div className="card-surface p-6">
          <p className="text-sm font-semibold text-muted-foreground">
            Click on each tab below to view its page — Defect Summary, Manual Verification and Compliance Report.
          </p>
          <div className="mt-4 flex flex-wrap gap-2" role="tablist">
            {resultTabs.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all",
                  tab === t.key
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary",
                )}
              >
                <t.icon className="size-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6" role="tabpanel">
          {tab === "defects" && <DefectSummaryPanel />}
          {tab === "manual" && <ManualVerificationPanel />}
          {tab === "report" && <ComplianceReportPanel />}
        </div>
      </section>

      {/* Hidden accessibility helper icon usage */}
      <span className="hidden"><RefreshCw className="size-4" /></span>
    </div>
  );
}
