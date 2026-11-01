import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Plus,
  Download,
  Upload,
  Trash2,
} from "lucide-react";
import { auditHistory, type AuditRow } from "@/lib/audit-data";
import { AuditStatusBadge, StandardChip, StatCard } from "@/components/shared";
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

const severityData = [
  { label: "Critical", count: 12, color: "var(--color-critical)" },
  { label: "Serious", count: 18, color: "var(--color-serious)" },
  { label: "Moderate", count: 11, color: "var(--color-moderate)" },
  { label: "Minor", count: 6, color: "var(--color-minor)" },
];

function ComplianceDonut() {
  // 92% compliant, 6% non-compliant, 2% not applicable
  const segments = [
    { pct: 92, color: "var(--color-primary)" },
    { pct: 6, color: "var(--color-destructive)" },
    { pct: 2, color: "var(--color-muted-foreground)" },
  ];
  const r = 70;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
      <svg viewBox="0 0 180 180" className="size-44 shrink-0 -rotate-90">
        <circle cx="90" cy="90" r={r} fill="none" stroke="var(--color-secondary)" strokeWidth="20" />
        {segments.map((s) => {
          const dash = (s.pct / 100) * c;
          const el = (
            <circle
              key={s.color}
              cx="90"
              cy="90"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="20"
              strokeDasharray={`${Math.max(dash - 2, 0)} ${c}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return el;
        })}
        <text x="90" y="86" textAnchor="middle" className="rotate-90" style={{ transformOrigin: "90px 86px" }}>
          <tspan x="90" y="84" className="fill-foreground text-[26px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
            92%
          </tspan>
          <tspan x="90" y="104" className="fill-muted-foreground text-[11px] font-semibold">
            Compliant
          </tspan>
        </text>
      </svg>
      <ul className="w-full max-w-xs space-y-3">
        {[
          { label: "Compliant", pct: "92%", color: "bg-primary" },
          { label: "Non-compliant", pct: "6%", color: "bg-destructive" },
          { label: "Not applicable", pct: "2%", color: "bg-muted-foreground" },
        ].map((l) => (
          <li key={l.label} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background px-4 py-2.5">
            <span className="flex items-center gap-2.5 text-sm font-medium">
              <span className={cn("size-2.5 rounded-full", l.color)} />
              {l.label}
            </span>
            <span className="text-sm font-bold">{l.pct}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SeverityChart() {
  const max = Math.max(...severityData.map((s) => s.count));
  return (
    <div className="grid h-full grid-cols-4 items-end gap-4 pt-6">
      {severityData.map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-2">
          <span className="text-sm font-bold">{s.count}</span>
          <div
            className="w-full max-w-14 rounded-t-lg transition-all"
            style={{ height: `${(s.count / max) * 150}px`, backgroundColor: s.color }}
          />
          <span className="text-xs font-semibold text-muted-foreground">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function Index() {
  const [audits, setAudits] = useState<AuditRow[]>(auditHistory);

  const handleDownload = (audit: AuditRow) => {
    toast.success(`Downloading audit report for ${audit.name}…`);
  };

  const handleImport = (audit: AuditRow, file: File) => {
    toast.success(`Imported "${file.name}" into ${audit.name}.`);
  };

  const handleDelete = (audit: AuditRow) => {
    setAudits((rows) => rows.filter((r) => r.id !== audit.id));
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

      {/* Stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<ShieldCheck className="size-6" />} value="92%" label="Compliance Score" trend="6% vs. last month" trendUp />
        <StatCard icon={<AlertTriangle className="size-6" />} value="47" label="Total Defects" trend="18% vs. last month" />
        <StatCard icon={<CheckCircle2 className="size-6" />} value="31" label="Resolved" trend="24% vs. last month" trendUp />
        <StatCard icon={<Clock3 className="size-6" />} value="8" label="Pending Verification" trend="33% vs. last month" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card-surface p-6">
          <h2 className="text-lg font-bold">Compliance Score</h2>
          <div className="mt-4">
            <ComplianceDonut />
          </div>
        </section>
        <section className="card-surface p-6">
          <h2 className="text-lg font-bold">Defects by Severity</h2>
          <SeverityChart />
        </section>
      </div>

      {/* Audit history table */}
      <section className="card-surface mt-6 overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <h2 className="text-lg font-bold">Audit History</h2>
            <p className="text-sm text-muted-foreground">Track, compare and revisit past audit runs</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-6 py-3 font-semibold">Audit name</th>
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
              {audits.map((audit) => (
                <tr key={audit.id} className="border-b border-border/70 transition-colors last:border-0 hover:bg-secondary/40">
                  <td className="px-6 py-3.5 font-bold">{audit.name}</td>
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
                        onClick={() => handleDownload(audit)}
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
                            if (f) handleImport(audit, f);
                            e.target.value = "";
                          }}
                        />
                      </label>
                      <button
                        aria-label={`Delete audit ${audit.name}`}
                        title="Delete"
                        onClick={() => handleDelete(audit)}
                        className="grid size-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {audits.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-muted-foreground">
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
