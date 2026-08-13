import { Zap, Clock, Star } from "lucide-react";
import { Card, StatusPill, SlaBadge } from "../../components/UI.jsx";
import { DonutChart, SparkTrend } from "../../components/Charts.jsx";
import { slaInfo, fmtDate, NOW } from "../../lib/helpers.js";
import { SlaGauge } from "../../components/BearingTracker.jsx";

export default function AdminDashboard({ claims, onOpenClaim }) {
  const statusCounts = [
    { label: "Approved", value: claims.filter((c) => c.status === "approved").length, color: "#16a34a" },
    { label: "Under Review", value: claims.filter((c) => c.status === "under_review").length, color: "#d97706" },
    { label: "Action Required", value: claims.filter((c) => c.status === "action_required").length, color: "#e11d48" },
    { label: "Rejected", value: claims.filter((c) => c.status === "rejected").length, color: "#64748b" },
  ];
  const breached = claims.filter((c) => slaInfo(c).breached);
  const atRisk = claims.filter((c) => { const s = slaInfo(c); return !s.terminal && !s.breached && s.msLeft < 8 * 3600 * 1000; });
  const resolved = claims.filter((c) => c.status === "approved" || c.status === "rejected");
  const onTimeRate = resolved.length ? Math.round((resolved.filter((c) => !slaInfo(c).breached).length / resolved.length) * 100) : 100;
  const trend = [
    { d: "5 Aug", onTime: 22, atRisk: 4, breached: 1 }, { d: "6 Aug", onTime: 25, atRisk: 5, breached: 2 },
    { d: "7 Aug", onTime: 21, atRisk: 6, breached: 1 }, { d: "8 Aug", onTime: 27, atRisk: 4, breached: 3 },
    { d: "9 Aug", onTime: 24, atRisk: 7, breached: 2 }, { d: "10 Aug", onTime: 29, atRisk: 5, breached: 2 },
    { d: "11 Aug", onTime: 26, atRisk: atRisk.length + 3, breached: breached.length },
  ];
  const topRisk = [...claims].filter((c) => !slaInfo(c).terminal).sort((a, b) => slaInfo(a).msLeft - slaInfo(b).msLeft).slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy-900">Good morning, Adjuster</h1>
        <p className="text-ink-500 text-sm mt-1">Here's what's happening with claims today, {fmtDate(NOW)}.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between"><p className="text-xs font-semibold text-ink-500 uppercase">On-Time Response Rate</p><Zap className="w-4 h-4 text-emerald-600" /></div>
          <p className="font-display text-3xl font-semibold text-navy-900 mt-2 num">{onTimeRate}%</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">+2.1% vs last week</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between"><p className="text-xs font-semibold text-ink-500 uppercase">Average Cycle Time</p><Clock className="w-4 h-4 text-bearing-600" /></div>
          <p className="font-display text-3xl font-semibold text-navy-900 mt-2 num">31.4 hrs</p>
          <p className="text-xs text-ink-500 mt-1">Target: 48 hrs</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between"><p className="text-xs font-semibold text-ink-500 uppercase">Public Trust Rating</p><Star className="w-4 h-4 text-brass-500" fill="currentColor" /></div>
          <p className="font-display text-3xl font-semibold text-navy-900 mt-2 num">4.6<span className="text-base text-ink-300">/5</span></p>
          <p className="text-xs text-ink-500 mt-1">From 128 resolved claims</p>
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
      </Card>
    </div>
  );
}
