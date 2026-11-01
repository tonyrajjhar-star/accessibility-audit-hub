import type { AuditStatus, DefectStatus, ReviewStatus, Severity } from "@/lib/audit-data";
import { cn } from "@/lib/utils";

export function AuditStatusBadge({ status }: { status: AuditStatus }) {
  const styles: Record<AuditStatus, string> = {
    Passed: "bg-success/12 text-success border-success/25",
    Failed: "bg-destructive/10 text-destructive border-destructive/25",
    "In Progress": "bg-primary/10 text-primary border-primary/25",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold", styles[status])}>
      <span className={cn("size-1.5 rounded-full", status === "Passed" ? "bg-success" : status === "Failed" ? "bg-destructive" : "bg-primary")} />
      {status}
    </span>
  );
}

const severityStyles: Record<Severity, string> = {
  Critical: "bg-critical text-white",
  Serious: "bg-serious text-white",
  Moderate: "bg-moderate text-warning-foreground",
  Minor: "bg-minor text-white",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold", severityStyles[severity])}>
      {severity}
    </span>
  );
}

export function DefectStatusBadge({ status }: { status: DefectStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold",
        status === "Active" ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-success/30 bg-success/10 text-success",
      )}
    >
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: "High" | "Medium" | "Low" }) {
  const styles = {
    High: "bg-destructive/10 text-destructive border-destructive/25",
    Medium: "bg-moderate/30 text-warning-foreground border-moderate/60",
    Low: "bg-success/10 text-success border-success/25",
  } as const;
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", styles[priority])}>
      {priority}
    </span>
  );
}

export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  const styles = {
    Pending: "bg-primary/10 text-primary border-primary/25",
    Approved: "bg-success/10 text-success border-success/25",
    Rejected: "bg-destructive/10 text-destructive border-destructive/25",
  } as const;
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", styles[status])}>
      {status}
    </span>
  );
}

export function StandardChip({ standard }: { standard: string }) {
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-md border border-primary/20 bg-primary/8 px-2 py-0.5 text-[11px] font-semibold text-primary">
      {standard}
    </span>
  );
}

export function StatCard({
  icon,
  value,
  label,
  trend,
  trendUp,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <div className="card-surface flex items-center gap-4 p-5">
      <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-secondary text-primary">{icon}</div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        {trend ? (
          <p className={cn("text-xs font-semibold", trendUp ? "text-success" : "text-destructive")}>
            {trendUp ? "↑" : "↓"} {trend}
          </p>
        ) : null}
      </div>
    </div>
  );
}
