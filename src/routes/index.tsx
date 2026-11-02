import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ChevronDown,
  Download,
  Upload,
  Trash2,
  Plus,
} from "lucide-react";
import { auditHistory, type AuditRow } from "@/lib/audit-data";
import { AuditStatusBadge, StandardChip } from "@/components/shared";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Accessibility Validator" },
      { name: "description", content: "Monitor your accessibility compliance and audit results at a glance." },
      { property: "og:title", content: "Dashboard — Accessibility Validator" },
      { property: "og:description", content: "Monitor your accessibility compliance and audit results at a glance." },
    ],
  }),
  component: Index,
});

const severityMeta = [
  { key: "Critical", label: "Critical", color: "var(--color-critical)" },
  { key: "Serious", label: "Serious", color: "var(--color-serious)" },
  { key: "Moderate", label: "Moderate", color: "var(--color-moderate)" },
  { key: "Minor", label: "Minor", color: "var(--color-minor)" },
] as const;

/** Small compliance donut for one audit row */
function RowDonut({ audit }: { audit: AuditRow }) {
  const { compliant, nonCompliant, notApplicable } = audit.complianceBreakdown;
  const segments = [
    { pct: compliant, color: "var(--color-primary)" },
    { pct: nonCompliant, color: "var(--color-destructive)" },
    { pct: notApplicable, color: "var(--color-muted-foreground)" },
  ];
  const r = 44;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 120 120" className="size-36 shrink-0 -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-secondary)" strokeWidth="14" />
        {segments.map((s) => {
          const dash = (s.pct / 100) * c;
          const el = (
            <circle
              key={s.color}
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="14"
              strokeDasharray={`${Math.max(dash - 2, 0)} ${c}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return el;
        })}
        <text x="60" y="58" textAnchor="middle" className="rotate-90" style={{ transformOrigin: "60px 58px" }}>
          <tspan x="60" y="58" className="fill-foreground text-[20px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
            {audit.score}%
          </tspan>
          <tspan x="60" y="74" className="fill-muted-foreground text-[9px] font-semibold">
            Compliant
          </tspan>
        </text>
      </svg>
      <ul className="w-full max-w-[220px] space-y-1.5">
        {[
          { label: "Compliant", pct: `${compliant}%`, color: "bg-primary" },
          { label: "Non-compliant", pct: `${nonCompliant}%`, color: "bg-destructive" },
          { label: "Not applicable", pct: `${notApplicable}%`, color: "bg-muted-foreground" },
        ].map((l) => (
          <li key={l.label} className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-2.5 py-1 text-xs">
            <span className="flex items-center gap-2 font-medium">
              <span className={cn("size-2 rounded-full", l.color)} />
              {l.label}
            </span>
            <span className="font-bold">{l.pct}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Small defects-by-severity bar chart for one audit row */
function RowSeverityChart({ audit }: { audit: AuditRow }) {
  const counts = severityMeta.map((s) => ({ ...s, count: audit.severityCounts[s.key] }));
  const max = Math.max(...counts.map((s) => s.count), 1);
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid flex-1 grid-cols-4 items-end gap-3">
        {counts.map((s) => (
          <div key={s.key} className="flex flex-col items-center gap-1.5">
            <span className="text-sm font-bold">{s.count}</span>
            <div
              className="w-full max-w-10 rounded-t-md transition-all"
              style={{ height: `${Math.max((s.count / max) * 110, 4)}px`, backgroundColor: s.color }}
            />
            <span className="text-[11px] font-semibold text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
        Total defects <span className="font-bold text-foreground">{audit.defectsFound}</span> · Resolved{" "}
        <span className="font-bold text-success">{audit.defectsFixed}</span> · Open{" "}
        <span className="font-bold text-destructive">{audit.defectsFound - audit.defectsFixed}</span>
      </div>
    </div>
  );
}

/** Four summary tiles for one audit row */
function RowStats({ audit }: { audit: AuditRow }) {
  const tiles = [
    { label: "Compliance Score", value: `${audit.score}%`, tone: audit.score >= 80 ? "text-success" : audit.score >= 60 ? "text-primary" : "text-destructive" },
    { label: "Total Defects", value: String(audit.defectsFound), tone: "text-foreground" },
    { label: "Resolved", value: String(audit.defectsFixed), tone: "text-success" },
    { label: "Pending Verification", value: String(audit.pendingVerification), tone: "text-primary" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 xl:grid-cols-2">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-xl border border-border bg-background px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground">{t.label}</p>
          <p className={cn("text-2xl font-bold tracking-tight", t.tone)}>{t.value}</p>
        </div>
      ))}
    </div>
  );
}

function Index() {
  const [audits, setAudits] = useState<AuditRow[]>(auditHistory);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDownload = (audit: AuditRow) => {
    toast.success(`Downloading audit report for ${audit.name}…`);
  };

  const handleImport = (audit: AuditRow, file: File) => {
    toast.success(`Imported "${file.name}" into ${audit.name}.`);
  };

  const handleDelete = (audit: AuditRow) => {
    setAudits((rows) => rows.filter((r) => r.id !== audit.id));
    setExpanded((prev) => {
      const next = new Set(prev);
      next.delete(audit.id);
      return next;
    });
    toast.success(`Audit "${audit.name}" deleted.`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Monitor your accessibility compliance and audit results</p>
        </div>
        <Link
          to="/new-audit"
          className="gradient-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03] active:scale-95"
        >
          <Plus className="size-4" strokeWidth={3} />
          New Audit
        </Link>
      </div>

      {/* Audit history table — each row expands to its score, defect and severity data */}
      <section className="card-surface mt-8 overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <h2 className="text-lg font-bold">Audit History</h2>
            <p className="text-sm text-muted-foreground">Track, compare and revisit past audit runs — click the expand icon on any row to see its compliance and defect details</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="w-12 px-4 py-3" aria-label="Expand row" />
                <th className="px-4 py-3 font-semibold">Audit name</th>
                <th className="px-4 py-3 font-semibold">Target URL</th>
                <th className="px-4 py-3 font-semibold">Standard</th>
                <th className="px-4 py-3 font-semibold">Compliance Score</th>
                <th className="px-4 py-3 font-semibold">Defects Found / Fixed</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {audits.map((audit) => {
                const isOpen = expanded.has(audit.id);
                return (
                  <AuditRowGroup
                    key={audit.id}
                    audit={audit}
                    isOpen={isOpen}
                    onToggle={() => toggleExpand(audit.id)}
                    onDownload={() => handleDownload(audit)}
                    onImport={(f) => handleImport(audit, f)}
                    onDelete={() => handleDelete(audit)}
                  />
                );
              })}
              {audits.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-muted-foreground">
                    No audits left — run a new audit to populate the history.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

interface AuditRowGroupProps {
  audit: AuditRow;
  isOpen: boolean;
  onToggle: () => void;
  onDownload: () => void;
  onImport: (file: File) => void;
  onDelete: () => void;
}

function AuditRowGroup({ audit, isOpen, onToggle, onDownload, onImport, onDelete }: AuditRowGroupProps) {
  return (
    <>
      <tr className={cn("border-b border-border/70 transition-colors hover:bg-secondary/40", isOpen && "bg-secondary/40")}>
        <td className="px-4 py-3.5">
          <button
            aria-label={isOpen ? `Collapse details for ${audit.name}` : `Expand details for ${audit.name}`}
            aria-expanded={isOpen}
            onClick={onToggle}
            className={cn(
              "grid size-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary",
              isOpen && "rotate-180 border-primary/40 bg-primary/10 text-primary",
            )}
          >
            <ChevronDown className="size-4" />
          </button>
        </td>
        <td className="px-4 py-3.5 font-bold">{audit.name}</td>
        <td className="px-4 py-3.5">
          <a href={audit.targetUrl} target="_blank" rel="noreferrer" className="font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary">
            {audit.targetUrl}
          </a>
        </td>
        <td className="px-4 py-3.5">
          <div className="flex max-w-52 flex-wrap gap-1.5">
            {audit.standards.map((s) => (
              <StandardChip key={s} standard={s} />
            ))}
          </div>
        </td>
        <td className="px-4 py-3.5">
          <span className={cn("text-base font-bold", audit.score >= 80 ? "text-success" : audit.score >= 60 ? "text-primary" : "text-destructive")}>
            {audit.score}%
          </span>
        </td>
        <td className="px-4 py-3.5 font-medium">
          {audit.defectsFound} / {audit.defectsFixed}
        </td>
        <td className="px-4 py-3.5">
          <AuditStatusBadge status={audit.status} />
        </td>
        <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground">{audit.date}</td>
        <td className="px-4 py-3.5">
          <div className="flex items-center justify-end gap-1.5">
            <button
              aria-label={`Download report for ${audit.name}`}
              title="Download file"
              onClick={onDownload}
              className="grid size-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
            >
              <Download className="size-4" />
            </button>
            <label
              aria-label={`Import file for ${audit.name}`}
              title="Import file"
              className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
            >
              <Upload className="size-4" />
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onImport(f);
                  e.target.value = "";
                }}
              />
            </label>
            <button
              aria-label={`Delete audit ${audit.name}`}
              title="Delete"
              onClick={onDelete}
              className="grid size-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </td>
      </tr>
      {isOpen && (
        <tr className={cn("border-b border-border/70 last:border-0", isOpen && "bg-secondary/20")}>
          <td colSpan={9} className="px-6 py-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto_auto] xl:gap-10">
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Summary — {audit.name}</h3>
                <RowStats audit={audit} />
              </div>
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Compliance Score</h3>
                <RowDonut audit={audit} />
              </div>
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Defects by Severity</h3>
                <div className="min-w-[260px]">
                  <RowSeverityChart audit={audit} />
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
