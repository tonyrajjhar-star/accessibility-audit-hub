import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, ExternalLink, Wand2, MapPin, Maximize2, Minimize2 } from "lucide-react";
import { defects, type Defect } from "@/lib/audit-data";
import { DefectStatusBadge, SeverityBadge, StandardChip } from "@/components/shared";
import { cn } from "@/lib/utils";

const severityOptions = ["All", "Critical", "Serious", "Moderate", "Minor"] as const;
const statusOptions = ["All", "Active", "Resolved"] as const;
const standardOptions = ["All", "WCAG 2.1 AA", "EN 301 549", "Section 508"] as const;

function selectClasses() {
  return "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm font-medium shadow-soft outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20";
}

export function DefectSummaryPanel() {
  const [severity, setSeverity] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");
  const [standard, setStandard] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>(defects[0]!.id);
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(
    () =>
      defects.filter((d) => {
        if (severity !== "All" && d.severity !== severity) return false;
        if (status !== "All" && d.status !== status) return false;
        if (standard !== "All" && !d.standards.some((s) => s.startsWith(standard))) return false;
        if (search && !`${d.id} ${d.title}`.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [severity, status, standard, search],
  );

  const selected: Defect = defects.find((d) => d.id === selectedId) ?? defects[0]!;
  const total = 47;
  const activeCount = defects.filter((d) => d.status === "Active").length + 18;
  const resolvedCount = defects.filter((d) => d.status === "Resolved").length + 10;

  const openLocation = (d: Defect) => {
    toast.info(`Opening ${d.locationFile} line ${d.locationLine} in your IDE…`);
  };

  return (
    <div>
      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-[repeat(3,minmax(0,1fr))_1.4fr]">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Severity</span>
          <select value={severity} onChange={(e) => setSeverity(e.target.value)} className={selectClasses()}>
            {severityOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClasses()}>
            {statusOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Standard</span>
          <select value={standard} onChange={(e) => setStandard(e.target.value)} className={selectClasses()}>
            {standardOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search defects…"
            className={selectClasses()}
          />
        </label>
      </div>

      {/* Stat cards */}
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {[
          { value: total, label: "Total Defects", tone: "text-foreground", icon: "📄" },
          { value: activeCount, label: "Active", tone: "text-destructive", icon: "⚠️" },
          { value: resolvedCount, label: "Resolved", tone: "text-success", icon: "✅" },
        ].map((s) => (
          <div key={s.label} className="card-surface flex items-center gap-4 p-4">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className={cn("text-3xl font-bold", s.tone)}>{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* List + detail */}
      <div className={cn("mt-6 grid gap-6", expanded ? "grid-cols-1" : "xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]")}>
        {/* List */}
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Issue</th>
                  <th className="px-4 py-3 font-semibold">Severity</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Standard</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr
                    key={d.id}
                    onClick={() => setSelectedId(d.id)}
                    className={cn(
                      "cursor-pointer border-b border-border/70 transition-colors last:border-0 hover:bg-secondary/40",
                      selectedId === d.id && "bg-secondary/70",
                    )}
                  >
                    <td className="px-4 py-3 font-bold text-primary">{d.id}</td>
                    <td className="px-4 py-3 font-medium">{d.title}</td>
                    <td className="px-4 py-3"><SeverityBadge severity={d.severity} /></td>
                    <td className="px-4 py-3"><DefectStatusBadge status={d.status} /></td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openLocation(d);
                        }}
                        className="font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
                        title={`Open ${d.locationFile}:${d.locationLine}`}
                      >
                        {d.locationFile.split("/").pop()}:{d.locationLine}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex max-w-44 flex-wrap gap-1">
                        {d.standards.map((s) => (
                          <StandardChip key={s} standard={s} />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                      No defects match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
            Showing {filtered.length} of {total} defects
          </p>
        </div>

        {/* Detail */}
        <div className="card-surface flex flex-col p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">{selected.id} — {selected.title}</h3>
              <div className="mt-2 flex gap-2">
                <SeverityBadge severity={selected.severity} />
                <DefectStatusBadge status={selected.status} />
              </div>
            </div>
            <button
              onClick={() => setExpanded((v) => !v)}
              title={expanded ? "Collapse panel" : "Expand panel for a bigger view"}
              aria-label={expanded ? "Collapse detail panel" : "Expand detail panel"}
              className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
            >
              {expanded ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <h4 className="text-sm font-bold">What is wrong?</h4>
              <p className="mt-1 text-sm text-muted-foreground">{selected.whatIsWrong}</p>
            </div>
            <div>
              <h4 className="text-sm font-bold">Where?</h4>
              <button
                onClick={() => openLocation(selected)}
                className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 font-mono text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                <MapPin className="size-3" />
                {selected.locationFile}
                <span className="text-muted-foreground">line {selected.locationLine}</span>
              </button>
            </div>
            <div>
              <h4 className="text-sm font-bold">Why it matters</h4>
              <p className="mt-1 text-sm text-muted-foreground">{selected.whyItMatters}</p>
            </div>
            <div>
              <h4 className="text-sm font-bold">Violated standard</h4>
              <p className="mt-1 text-sm font-medium text-foreground">{selected.violatedStandard}</p>
            </div>
            <div>
              <h4 className="text-sm font-bold">Impact</h4>
              <p className="mt-1 text-sm text-muted-foreground">{selected.impact}</p>
            </div>
            <div>
              <h4 className="text-sm font-bold">Recommended fix</h4>
              <p className="mt-1 text-sm text-muted-foreground">{selected.recommendedFix}</p>
            </div>

            {/* Action buttons — below the recommended fix, above the code blocks */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => toast.success("Patch copied to clipboard.")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3.5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                <Copy className="size-4" /> Copy Patch
              </button>
              <button
                onClick={() => openLocation(selected)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3.5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                <ExternalLink className="size-4" /> View in IDE
              </button>
              <button
                onClick={() => toast.success("Auto fix queued for this defect.")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3.5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                <Wand2 className="size-4" /> Auto Fix
              </button>
            </div>

            {/* Code comparison */}
            <div className={cn("grid gap-3", expanded ? "md:grid-cols-2" : "grid-cols-1")}>
              <div className="overflow-hidden rounded-xl border border-destructive/25">
                <p className="bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive">Current code</p>
                <pre className="overflow-x-auto bg-[oklch(0.22_0.04_265)] p-3 text-xs leading-relaxed text-[oklch(0.92_0.02_250)]"><code>{selected.currentCode}</code></pre>
              </div>
              <div className="overflow-hidden rounded-xl border border-success/25">
                <p className="bg-success/10 px-3 py-1.5 text-xs font-bold text-success">Recommended code</p>
                <pre className="overflow-x-auto bg-[oklch(0.22_0.04_265)] p-3 text-xs leading-relaxed text-[oklch(0.92_0.02_250)]"><code>{selected.recommendedCode}</code></pre>
              </div>
            </div>

            <button
              onClick={() => toast.success(`Auto fix applied to ${selected.id}.`)}
              className="gradient-primary w-full rounded-xl py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.01] active:scale-95"
            >
              <Wand2 className="mr-1.5 inline size-4" /> Apply Auto Fix
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
