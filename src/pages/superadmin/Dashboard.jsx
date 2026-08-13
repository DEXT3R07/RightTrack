import { Send, CheckCircle2, AlertTriangle, Star, Users, ShieldCheck } from "lucide-react";
import { Card, StatusPill } from "../../components/UI.jsx";
import { DonutChart, SparkTrend } from "../../components/Charts.jsx";
import { slaInfo, fmtDate, fmtMoney, NOW } from "../../lib/helpers.js";
import { CATEGORY_META } from "../../lib/constants.js";

export default function SuperAdminDashboard({ claims, adjusters, policyholders, onOpenClaim, onNav }) {
  const claimsSent = claims.length;
  const resolved = claims.filter((c) => c.status === "approved" || c.status === "rejected");
  const claimsAttended = resolved.length;
  const breachedClaims = claims.filter((c) => slaInfo(c).breached);
  const rated = claims.filter((c) => c.rating && c.rating.stars);
  const avgRating = rated.length ? (rated.reduce((s, c) => s + c.rating.stars, 0) / rated.length) : 0;

  const statusCounts = [
    { label: "Approved", value: claims.filter((c) => c.status === "approved").length, color: "#16a34a" },
    { label: "Under Review", value: claims.filter((c) => c.status === "under_review").length, color: "#d97706" },
    { label: "Action Required", value: claims.filter((c) => c.status === "action_required").length, color: "#e11d48" },
    { label: "Rejected", value: claims.filter((c) => c.status === "rejected").length, color: "#64748b" },
  ];

  const categoryCounts = Object.keys(CATEGORY_META).map((cat) => ({
    label: cat, value: claims.filter((c) => c.category === cat).length, color: CATEGORY_META[cat].color,
  }));

  const trend = [
    { d: "5 Aug", onTime: 22, atRisk: 4, breached: 1 }, { d: "6 Aug", onTime: 25, atRisk: 5, breached: 2 },
    { d: "7 Aug", onTime: 21, atRisk: 6, breached: 1 }, { d: "8 Aug", onTime: 27, atRisk: 4, breached: 3 },
    { d: "9 Aug", onTime: 24, atRisk: 7, breached: 2 }, { d: "10 Aug", onTime: 29, atRisk: 5, breached: 2 },
    { d: "11 Aug", onTime: 26, atRisk: 5, breached: breachedClaims.length },
  ];

  const adjusterStats = adjusters.map((a) => {
    const owned = claims.filter((c) => c.adjuster === a.name);
    const ownedResolved = owned.filter((c) => c.status === "approved" || c.status === "rejected");
    const ownedBreached = owned.filter((c) => slaInfo(c).breached);
    const ownedRated = owned.filter((c) => c.rating && c.rating.stars);
    const rating = ownedRated.length ? ownedRated.reduce((s, c) => s + c.rating.stars, 0) / ownedRated.length : null;
    return { ...a, claimsAssigned: owned.length, claimsAttended: ownedResolved.length, claimsBreached: ownedBreached.length, rating };
  }).sort((a, b) => b.claimsAttended - a.claimsAttended);

  const recentRatings = claims.filter((c) => c.rating && c.rating.review).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy-900">Super Admin Overview</h1>
        <p className="text-ink-500 text-sm mt-1">Platform-wide performance across every adjuster and policyholder, {fmtDate(NOW)}.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between"><p className="text-xs font-semibold text-ink-500 uppercase">Claims Sent</p><Send className="w-4 h-4 text-bearing-600" /></div>
          <p className="font-display text-3xl font-semibold text-navy-900 mt-2 num">{claimsSent}</p>
          <p className="text-xs text-ink-500 mt-1">Total submitted to date</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between"><p className="text-xs font-semibold text-ink-500 uppercase">Claims Attended To</p><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
          <p className="font-display text-3xl font-semibold text-navy-900 mt-2 num">{claimsAttended}</p>
          <p className="text-xs text-ink-500 mt-1">{claimsSent ? Math.round((claimsAttended / claimsSent) * 100) : 0}% resolved to a decision</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between"><p className="text-xs font-semibold text-ink-500 uppercase">Claims Breached</p><AlertTriangle className="w-4 h-4 text-red-600" /></div>
          <p className="font-display text-3xl font-semibold text-navy-900 mt-2 num">{breachedClaims.length}</p>
          <p className="text-xs text-red-600 mt-1 font-medium">{breachedClaims.length > 0 ? "Needs escalation" : "No active breaches"}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between"><p className="text-xs font-semibold text-ink-500 uppercase">Average Rating</p><Star className="w-4 h-4 text-brass-500" fill="currentColor" /></div>
          <p className="font-display text-3xl font-semibold text-navy-900 mt-2 num">{avgRating ? avgRating.toFixed(1) : "—"}<span className="text-base text-ink-300">/5</span></p>
          <p className="text-xs text-ink-500 mt-1">From {rated.length} rated claim(s)</p>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between"><p className="text-xs font-semibold text-ink-500 uppercase">Adjusters on Roster</p><Users className="w-4 h-4 text-navy-700" /></div>
          <p className="font-display text-3xl font-semibold text-navy-900 mt-2 num">{adjusters.filter((a) => a.status === "active").length}<span className="text-base text-ink-300"> / {adjusters.length}</span></p>
          <button onClick={() => onNav("sa-adjusters")} className="text-xs font-semibold text-bearing-600 hover:underline mt-1">Manage adjusters →</button>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between"><p className="text-xs font-semibold text-ink-500 uppercase">Policyholders on Platform</p><ShieldCheck className="w-4 h-4 text-navy-700" /></div>
          <p className="font-display text-3xl font-semibold text-navy-900 mt-2 num">{policyholders.filter((p) => p.status === "active").length}<span className="text-base text-ink-300"> / {policyholders.length}</span></p>
          <button onClick={() => onNav("sa-policyholders")} className="text-xs font-semibold text-bearing-600 hover:underline mt-1">Manage policyholders →</button>
        </Card>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <Card className="p-5 lg:col-span-2">
          <p className="font-display font-semibold text-navy-900 mb-4">Claims by Status</p>
          <DonutChart data={statusCounts} />
        </Card>
        <Card className="p-5 lg:col-span-3">
          <div className="flex items-center justify-between mb-1">
            <p className="font-display font-semibold text-navy-900">SLA Performance Trend</p>
            <div className="flex items-center gap-3 text-[11px] text-ink-500">
              <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></i>On-time</span>
              <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-amber-500 inline-block"></i>At risk</span>
              <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-red-600 inline-block"></i>Breached</span>
            </div>
          </div>
          <div className="mt-3"><SparkTrend points={trend} /></div>
          <div className="flex justify-between mt-1 text-[10px] text-ink-300">{trend.map((t) => <span key={t.d}>{t.d}</span>)}</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <Card className="p-0 overflow-hidden lg:col-span-3">
          <div className="px-5 py-4 border-b border-ink-900/6 flex items-center justify-between">
            <p className="font-display font-semibold text-navy-900">Adjuster Performance</p>
            <button onClick={() => onNav("sa-adjusters")} className="text-xs font-semibold text-bearing-600 hover:underline">View all</button>
          </div>
          <div className="divide-y divide-ink-900/6">
            {adjusterStats.map((a) => (
              <div key={a.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-9 h-9 rounded-full bg-navy-100 text-navy-700 flex items-center justify-center text-xs font-bold shrink-0">{a.name.split(" ").map((s) => s[0]).join("")}</div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-navy-900 truncate">{a.name}</p>
                  <p className="text-xs text-ink-500 truncate">{a.unit} · {a.claimsAttended}/{a.claimsAssigned} attended{a.claimsBreached ? ` · ${a.claimsBreached} breached` : ""}</p>
                </div>
                {a.rating != null && <span className="inline-flex items-center gap-1 text-xs font-semibold text-navy-900 shrink-0"><Star className="w-3.5 h-3.5 text-brass-500" fill="currentColor" />{a.rating.toFixed(1)}</span>}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-0 overflow-hidden lg:col-span-2">
          <div className="px-5 py-4 border-b border-ink-900/6"><p className="font-display font-semibold text-navy-900">Recent Feedback</p></div>
          <div className="divide-y divide-ink-900/6">
            {recentRatings.length === 0 && <p className="text-sm text-ink-500 px-5 py-6">No policyholder ratings yet.</p>}
            {recentRatings.map((c) => (
              <button key={c.id} onClick={() => onOpenClaim(c.id)} className="w-full text-left px-5 py-3.5 hover:bg-navy-50/60">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-navy-900">{c.applicant}</p>
                  <span className="inline-flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < c.rating.stars ? "text-brass-500" : "text-ink-900/10"}`} fill="currentColor" />)}</span>
                </div>
                <p className="text-xs text-ink-500 mt-1 line-clamp-2">"{c.rating.review}"</p>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
