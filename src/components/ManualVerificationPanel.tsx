import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ExternalLink, Search, Eye } from "lucide-react";
import { reviewItems, type ReviewItem, type ReviewStatus } from "@/lib/audit-data";
import { PriorityBadge } from "@/components/shared";
import { cn } from "@/lib/utils";

const tabs = ["Pending", "Approved", "Rejected"] as const;
const priorities = ["All", "High", "Medium", "Low"] as const;

function selectClasses() {
  return "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm font-medium shadow-soft outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20";
}

export function ManualVerificationPanel() {
  const [items, setItems] = useState<ReviewItem[]>(reviewItems);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Pending");
  const [priority, setPriority] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [drafts, setDrafts] = useState<Record<string, { decision: "Approved" | "Rejected"; notes: string }>>({});

  const counts = useMemo(
    () => ({
      Pending: items.filter((i) => i.status === "Pending").length,
      Approved: items.filter((i) => i.status === "Approved").length,
      Rejected: items.filter((i) => i.status === "Rejected").length,
    }),
    [items],
  );

  const filtered = useMemo(
    () =>
      items.filter((i) => {
        if (i.status !== tab) return false;
        if (priority !== "All" && i.priority !== priority) return false;
        if (search && !`${i.id} ${i.title}`.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [items, tab, priority, search],
  );

  const saveReview = (item: ReviewItem) => {
    const draft = drafts[item.id];
    if (!draft) return;
    setItems((rows) => rows.map((r) => (r.id === item.id ? { ...r, status: draft.decision as ReviewStatus } : r)));
    setDrafts((d) => {
      const next = { ...d };
      delete next[item.id];
      return next;
    });
    toast.success(`${item.id} marked as ${draft.decision.toLowerCase()}.`);
    if (draft.decision !== "Approved" && tab === "Pending" && filtered.length === 1) setTab("Pending");
  };

  const openLocation = (item: ReviewItem) => {
    toast.info(`Opening ${item.locationFile} line ${item.locationLine} in your IDE…`);
  };

  return (
    <div>
      {/* Status tabs + search + filter */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex gap-1 rounded-xl border border-border bg-card p-1 shadow-soft">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                tab === t ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {t} ({counts[t]})
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap items-end gap-3">
          <label className="block w-56">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Search</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search issues…"
                className={cn(selectClasses(), "pl-9")}
              />
            </div>
          </label>
          <label className="block w-40">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Priority</span>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className={selectClasses()}>
              {priorities.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Review cards */}
      <div className="mt-6 space-y-4">
        {filtered.map((item) => {
          const draft = drafts[item.id];
          return (
            <div key={item.id} className={cn("card-surface grid gap-6 p-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]", draft && "border-primary/40 ring-2 ring-primary/15")}>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold">{item.id} — {item.title}</h3>
                  <PriorityBadge priority={item.priority} />
                </div>
                <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
                  <dt className="font-semibold text-muted-foreground">Reason</dt>
                  <dd>{item.reason}</dd>
                  <dt className="font-semibold text-muted-foreground">Location</dt>
                  <dd>
                    <button
                      onClick={() => openLocation(item)}
                      className="rounded bg-secondary px-2 py-0.5 font-mono text-xs font-semibold text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:bg-primary/10 hover:decoration-primary"
                    >
                      {item.locationFile} line {item.locationLine}
                    </button>
                  </dd>
                  <dt className="font-semibold text-muted-foreground">Action required</dt>
                  <dd>{item.actionRequired}</dd>
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => toast.info(`Highlighting ${item.id} in the running app…`)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
                  >
                    <Eye className="size-3.5" /> Highlight in App
                  </button>
                  <button
                    onClick={() => openLocation(item)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
                  >
                    <ExternalLink className="size-3.5" /> View in IDE
                  </button>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex gap-5">
                  {(["Approved", "Rejected"] as const).map((decision) => (
                    <label key={decision} className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                      <input
                        type="radio"
                        name={`decision-${item.id}`}
                        checked={draft?.decision === decision}
                        onChange={() =>
                          setDrafts((d) => ({ ...d, [item.id]: { decision, notes: d[item.id]?.notes ?? "" } }))
                        }
                        className="size-4 accent-[var(--color-primary)]"
                      />
                      {decision}
                    </label>
                  ))}
                </div>
                <label className="mt-3 block">
                  <span className="text-sm font-semibold">Reviewer notes</span>
                  <textarea
                    rows={3}
                    value={draft?.notes ?? ""}
                    placeholder="Add your notes here…"
                    onChange={(e) =>
                      setDrafts((d) => ({
                        ...d,
                        [item.id]: { decision: d[item.id]?.decision ?? "Approved", notes: e.target.value },
                      }))
                    }
                    className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-soft outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                </label>
                <button
                  disabled={!draft}
                  onClick={() => saveReview(item)}
                  className="mt-3 w-full rounded-lg bg-primary py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Save review
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="card-surface px-6 py-12 text-center text-muted-foreground">
            Nothing {tab.toLowerCase()} here{search || priority !== "All" ? " with the current search and filters" : ""}.
          </div>
        )}
      </div>
    </div>
  );
}
