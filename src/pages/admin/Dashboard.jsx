import { Zap, Clock, Star, Folder } from "lucide-react";
import { Card, StatusPill, SlaBadge, EmptyState } from "../../components/UI.jsx";
import { DonutChart, SparkTrend } from "../../components/Charts.jsx";
import { slaInfo, fmtDate, NOW, avgResolutionHours, last7DaysTrend } from "../../lib/helpers.js";
import { SlaGauge } from "../../components/BearingTracker.jsx";

export default function AdminDashboard({ claims, onOpenClaim, profile }) {
  const statusCounts = [
    { label: "Approved", value: claims.filter((c) => c.status === "approved").length, color: "#16a34a" },
    { label: "Under Review", value: claims.filter((c) => c.status === "under_review").length, color: "#d97706" },
    { label: "Action Required", value: claims.filter((c) => c.status === "action_required").length, color: "#e11d48" },
    { label: "Rejected", value: claims.filter((c) => c.status === "rejected").length, color: "#64748b" },
  ];
  const breached = claims.filter((c) => slaInfo(c).breached);
  const atRisk = claims.filter((c) => { const s = slaInfo(c); return !s.terminal && !s.breached && s.msLeft < 8 * 3600 * 1000; });
  const resolved = claims.filter((c) => c.status === "approved" || c.status === "rejected");
  const onTimeRate = resolved.length ? Math.round((resolved.filter((c) => !slaInfo(c).breached).length / resolved.length) * 100) : null;
  const avgCycle = avgResolutionHours(claims);
  const rated = claims.filter((c) => c.rating && c.rating.stars);
  const avgRating = rated.length ? rated.reduce((s, c) => s + c.rating.stars, 0) / rated.length : null;
  const trend = last7DaysTrend(claims);
  const topRisk = [...claims].filter((c) => !slaInfo(c).terminal).sort((a, b) => slaInfo(a).msLeft - slaInfo(b).msLeft).slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy-900">Good morning{profile?.fullName ? `, ${profile.fullName.split(" ")[0]}` : ", Adjuster"}</h1>
        <p className="text-ink-500 text-sm mt-1">Here's what's happening with claims today, {fmtDate(NOW)}.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5" hoverable>
          <div className="flex items-center justify-between"><p className="text-xs font-semibold text-ink-500 uppercase">On-Time Response Rate</p><Zap className="w-4 h-4 text-emerald-600" /></div>
          <p className="font-display text-3xl font-semibold text-navy-900 mt-2 num">{onTimeRate != null ? `${onTimeRate}%` : "—"}</p>
          <p className="text-xs text-ink-500 mt-1">{resolved.length ? `From ${resolved.length} resolved claim(s)` : "No resolved claims yet"}</p>
        </Card>
        <Card className="p-5" hoverable>
          <div className="flex items-center justify-between"><p className="text-xs font-semibold text-ink-500 uppercase">Average Cycle Time</p><Clock className="w-4 h-4 text-bearing-600" /></div>
          <p className="font-display text-3xl font-semibold text-navy-900 mt-2 num">{avgCycle != null ? `${avgCycle.toFixed(1)} hrs` : "—"}</p>
          <p className="text-xs text-ink-500 mt-1">Target: 48 hrs</p>
        </Card>
        <Card className="p-5" hoverable>
          <div className="flex items-center justify-between"><p className="text-xs font-semibold text-ink-500 uppercase">Public Trust Rating</p><Star className="w-4 h-4 text-brass-500" fill="currentColor" /></div>
          <p className="font-display text-3xl font-semibold text-navy-900 mt-2 num">{avgRating != null ? avgRating.toFixed(1) : "—"}<span className="text-base text-ink-300">/5</span></p>
          <p className="text-xs text-ink-500 mt-1">{rated.length ? `From ${rated.length} resolved claim(s)` : "No ratings yet"}</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <Card className="p-5 lg:col-span-2">
          <p className="font-display font-semibold text-navy-900 mb-4">Claims Overview (By Status)</p>
          <DonutChart data={statusCounts} />
          <p className="text-xs text-ink-500 mt-4 pt-4 border-t border-ink-900/6">Total claims: <span className="font-semibold text-navy-900">{claims.length}</span></p>
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

      <Card className="p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-ink-900/6 flex items-center justify-between">
          <p className="font-display font-semibold text-navy-900">SLA Monitor — Top at Risk</p>
          <span className="text-xs font-bold text-red-600">{breached.length} breached · {atRisk.length} at risk</span>
        </div>
        {topRisk.length === 0 ? (
          <EmptyState icon={<Folder className="w-6 h-6" />} title="No claims to monitor" body="Claims approaching their SLA deadline will show up here." />
        ) : (
          <div className="divide-y divide-ink-900/6">
            {topRisk.map((c) => {
              const s = slaInfo(c);
              return (
                <button key={c.id} onClick={() => onOpenClaim(c.id)} className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-navy-50/60 text-left">
                  <SlaGauge claim={c} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-navy-900">{c.id} <span className="text-ink-300 font-normal">·</span> <span className="text-ink-500 font-normal">{c.applicant}</span></p>
                    <div className="h-1.5 rounded-full bg-ink-900/6 mt-1.5 max-w-xs overflow-hidden">
                      <div className={`h-full rounded-full ${s.breached ? "bg-red-600" : s.pct > 75 ? "bg-amber-500" : "bg-bearing-600"}`} style={{ width: `${s.pct}%` }}></div>
                    </div>
                  </div>
                  <SlaBadge claim={c} compact />
                  <StatusPill status={c.status} />
                </button>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
