import { toast } from "sonner";
import { Download, Upload, FileCheck2 } from "lucide-react";
import { complianceReport } from "@/lib/audit-data";
import { StandardChip } from "@/components/shared";
import { cn } from "@/lib/utils";

export function ComplianceReportPanel() {
  const { auditName, targetUrl, date, score, standards, summary, breakdown } = complianceReport;
  const maxBreakdown = Math.max(...breakdown.map((b) => b.passed + b.failed));

  return (
    <div>
      {/* Export / Import actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => toast.success("Compliance report exported as PDF.")}
          className="gradient-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03] active:scale-95"
        >
          <Download className="size-4" /> Export PDF
        </button>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/15">
          <Upload className="size-4" /> Import PDF
          <input
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) toast.success(`Imported "${f.name}" — signatures and annotations merged into the report.`);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {/* Report overview */}
      <div className="card-surface mt-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-start gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary">
              <FileCheck2 className="size-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold">Compliance Report — {auditName}</h3>
              <a href={targetUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary">
                {targetUrl}
              </a>
              <p className="mt-0.5 text-xs text-muted-foreground">Generated {date}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={cn("text-4xl font-bold", score >= 80 ? "text-success" : score >= 60 ? "text-primary" : "text-destructive")}>{score}%</p>
            <p className="text-xs font-semibold text-muted-foreground">Overall compliance</p>
          </div>
        </div>

        <div className="grid gap-6 pt-5 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-bold">Standards assessed</h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {standards.map((s) => (
                <StandardChip key={s} standard={s} />
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { label: "Checks run", value: summary.totalChecks, tone: "text-foreground" },
                { label: "Passed", value: summary.passed, tone: "text-success" },
                { label: "Failed", value: summary.failed, tone: "text-destructive" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-background p-3 text-center">
                  <p className={cn("text-2xl font-bold", s.tone)}>{s.value}</p>
                  <p className="text-xs font-semibold text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold">Results by principle</h4>
            <ul className="mt-3 space-y-3">
              {breakdown.map((b) => {
                const total = b.passed + b.failed;
                return (
                  <li key={b.area}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">{b.area}</span>
                      <span className="text-muted-foreground">
                        {b.passed} passed · {b.failed} failed
                      </span>
                    </div>
                    <div className="mt-1 flex h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="bg-success" style={{ width: `${(b.passed / maxBreakdown) * 100}%` }} />
                      <div className="bg-destructive" style={{ width: `${(b.failed / maxBreakdown) * 100}%` }} />
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{total} checks</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
