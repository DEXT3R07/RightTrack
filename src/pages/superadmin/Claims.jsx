import { useState } from "react";
import { Search, AlertTriangle, Eye, Download } from "lucide-react";
import { Card, StatusPill, SlaBadge } from "../../components/UI.jsx";
import { CATEGORY_META, STATUS_META } from "../../lib/constants.js";
import { slaInfo, fmtDate, fmtMoney } from "../../lib/helpers.js";

export default function SuperAdminClaims({ claims, adjusters, onOpenClaim }) {
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [adjusterF, setAdjusterF] = useState("all");

  let rows = claims.filter(
    (c) =>
      (statusF === "all" || c.status === statusF) &&
      (adjusterF === "all" || c.adjuster === adjusterF) &&
      (c.id.toLowerCase().includes(q.toLowerCase()) || c.applicant.toLowerCase().includes(q.toLowerCase()) || c.policyId.toLowerCase().includes(q.toLowerCase()))
  ).map((c) => ({ c, s: slaInfo(c) }));
  rows.sort((a, b) => {
    if (a.s.breached !== b.s.breached) return a.s.breached ? -1 : 1;
    return new Date(b.c.submittedAt) - new Date(a.c.submittedAt);
  });

  const exportCsv = () => {
    const header = ["Claim ID", "Policyholder", "Policy No.", "Adjuster", "Category", "Amount", "Status", "Submitted"];
    const lines = rows.map(({ c }) => [c.id, c.applicant, c.policyId, c.adjuster, c.category, c.amount, STATUS_META[c.status].label, fmtDate(c.submittedAt)]);
    const csv = [header, ...lines].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `righttrack-all-claims.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl font-semibold text-navy-900">All Claims — Platform Oversight</h1>
        <div className="flex items-center gap-3">
          <p className="text-xs text-ink-500">{rows.filter((r) => r.s.breached).length} breached · {rows.length} shown</p>
          <button onClick={exportCsv} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-navy-900 text-white hover:bg-navy-700 transition">
            <Download className="w-3.5 h-3.5" />Export CSV
          </button>
        </div>
      </div>
      <Card className="p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by claim ID, name, or policy no..." className="input pl-9" />
        </div>
        <select value={statusF} onChange={(e) => setStatusF(e.target.value)} className="input w-auto">
          <option value="all">All Status</option>
          {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={adjusterF} onChange={(e) => setAdjusterF(e.target.value)} className="input w-auto">
          <option value="all">All Adjusters</option>
          {adjusters.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
        </select>
      </Card>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-bold uppercase text-ink-500 border-b border-ink-900/6">
                <th className="px-5 py-3">Claim</th><th className="px-5 py-3">Policyholder</th><th className="px-5 py-3">Adjuster</th>
                <th className="px-5 py-3">Category</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">SLA</th><th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ c, s }) => (
                <tr key={c.id} className={`border-b border-ink-900/5 last:border-0 hover:bg-navy-50/50 transition ${s.breached ? "bg-red-50/60" : ""}`}>
                  <td className="px-5 py-3.5">
                    <p className={`font-semibold ${s.breached ? "text-red-700" : "text-navy-900"}`}>{c.id}</p>
                    <p className="text-xs text-ink-500">{fmtDate(c.submittedAt)}</p>
                  </td>
                  <td className="px-5 py-3.5 text-ink-700">{c.applicant}<br /><span className="text-xs text-ink-300">{c.policyId}</span></td>
                  <td className="px-5 py-3.5 text-ink-700">{c.adjuster}</td>
                  <td className="px-5 py-3.5"><span className="text-xs font-bold px-2 py-1 rounded-md" style={{ background: CATEGORY_META[c.category].bg, color: CATEGORY_META[c.category].color }}>{c.category}</span></td>
                  <td className="px-5 py-3.5 font-medium text-navy-900 num">{fmtMoney(c.amount)}</td>
                  <td className="px-5 py-3.5"><StatusPill status={c.status} /></td>
                  <td className="px-5 py-3.5">
                    {s.breached ? <span className="inline-flex items-center gap-1 text-xs font-extrabold text-red-700"><AlertTriangle className="w-3.5 h-3.5" />BREACHED</span> : <SlaBadge claim={c} compact />}
                  </td>
                  <td className="px-5 py-3.5"><button onClick={() => onOpenClaim(c.id)} className="p-2 rounded-lg hover:bg-navy-100 text-navy-700"><Eye className="w-4 h-4" /></button></td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-sm text-ink-500">No claims match these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
