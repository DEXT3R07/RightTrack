import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, StatusPill, SlaBadge } from "../../components/UI.jsx";
import { CATEGORY_META, STATUS_META } from "../../lib/constants.js";
import { fmtMoney } from "../../lib/helpers.js";

export default function MyClaims({ claims, onOpenClaim, onNav }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? claims : claims.filter((c) => c.status === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl font-semibold text-navy-900">My Claims</h1>
        <button onClick={() => onNav("new")} className="inline-flex items-center gap-2 bg-navy-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-navy-800">
          <Plus className="w-4 h-4" />New Claim
        </button>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {["all", "submitted", "under_review", "action_required", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold ring-1 transition ${
              filter === f ? "bg-navy-900 text-white ring-navy-900" : "bg-white text-ink-700 ring-ink-900/10 hover:ring-navy-900/30"
            }`}
          >
            {f === "all" ? "All" : STATUS_META[f].label}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c) => {
          const cat = CATEGORY_META[c.category];
          return (
            <Card key={c.id} className="p-5 hover:shadow-pop transition cursor-pointer" onClick={() => onOpenClaim(c.id)}>
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold px-2 py-1 rounded-md" style={{ background: cat.bg, color: cat.color }}>{c.category}</span>
                <StatusPill status={c.status} />
              </div>
              <p className="font-display font-semibold text-navy-900 mt-3">{c.id}</p>
              <p className="text-xs text-ink-500 mt-0.5">{c.policyId}</p>
              <p className="text-sm text-ink-700 mt-3 line-clamp-2 leading-relaxed">{c.description}</p>
              <div className="mt-4 pt-4 border-t border-ink-900/6 flex items-center justify-between">
                <p className="font-display font-semibold text-navy-900 num">{fmtMoney(c.amount)}</p>
                <SlaBadge claim={c} compact />
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && <p className="text-sm text-ink-500 col-span-full text-center py-10">No claims in this category.</p>}
      </div>
    </div>
  );
}
