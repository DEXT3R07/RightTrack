import { Plus, FileText, Clock, AlertTriangle, Check, ChevronRight, Folder } from "lucide-react";
import { Card, StatusPill, SlaBadge, EmptyState } from "../../components/UI.jsx";
import { CATEGORY_META } from "../../lib/constants.js";
import { fmtDate, fmtMoney } from "../../lib/helpers.js";

export default function ApplicantDashboard({ claims, onNav, onOpenClaim }) {
  const counts = {
    submitted: claims.filter((c) => c.status === "submitted").length,
    under_review: claims.filter((c) => c.status === "under_review").length,
    approved: claims.filter((c) => c.status === "approved").length,
    action_required: claims.filter((c) => c.status === "action_required").length,
  };
  const recent = [...claims].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 5);

  if (claims.length === 0) {
    return (
      <EmptyState
        icon={<Folder className="w-6 h-6" />}
        title="No claims yet"
        body="Submit your first claim and track it live from here."
        action={
          <button onClick={() => onNav("new")} className="mt-5 inline-flex items-center gap-2 bg-navy-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-navy-800">
            <Plus className="w-4 h-4" />Submit Your First Claim
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900">Welcome back, Policy Holder</h1>
          <p className="text-ink-500 text-sm mt-1">Here's what's happening with your claims today.</p>
        </div>
        <button onClick={() => onNav("new")} className="inline-flex items-center gap-2 bg-navy-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-navy-800">
          <Plus className="w-4 h-4" />New Claim
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          ["Submitted", counts.submitted, "text-ink-700", <FileText className="w-4 h-4" key="i" />],
          ["Under Review", counts.under_review, "text-amber-700", <Clock className="w-4 h-4" key="i" />],
          ["Action Required", counts.action_required, "text-rose-700", <AlertTriangle className="w-4 h-4" key="i" />],
          ["Approved", counts.approved, "text-emerald-700", <Check className="w-4 h-4" key="i" />],
        ].map(([l, v, c, ic]) => (
          <Card key={l} className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{l}</p>
              <span className={c}>{ic}</span>
            </div>
            <p className={`font-display text-3xl font-semibold mt-2 num ${c}`}>{v}</p>
          </Card>
        ))}
      </div>
      <Card className="p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-ink-900/6 flex items-center justify-between">
          <p className="font-display font-semibold text-navy-900">Recent Claims</p>
          <button onClick={() => onNav("claims")} className="text-xs font-semibold text-bearing-600 hover:underline">View all</button>
        </div>
        <div className="divide-y divide-ink-900/6">
          {recent.map((c) => {
            const cat = CATEGORY_META[c.category];
            return (
              <button key={c.id} onClick={() => onOpenClaim(c.id)} className="w-full flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 px-5 py-4 hover:bg-navy-50/60 transition text-left">
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: cat.bg, color: cat.color }}>
                    <FileText className="w-4.5 h-4.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-navy-900 truncate">{c.id} <span className="text-ink-300 font-normal">·</span> <span className="text-ink-500 font-normal">{c.category}</span></p>
                    <p className="text-xs text-ink-500 mt-0.5 truncate">Submitted {fmtDate(c.submittedAt)} · {fmtMoney(c.amount)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-[3.25rem] sm:pl-0 sm:ml-auto shrink-0">
                  <StatusPill status={c.status} />
                  <SlaBadge claim={c} compact />
                  <ChevronRight className="w-4 h-4 text-ink-300 hidden sm:block shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
