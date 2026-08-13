import { useState } from "react";
import { Search, Mail, Phone, MessageSquare, Ban, CheckCircle2, FileText } from "lucide-react";
import { Card } from "../../components/UI.jsx";
import MessageModal from "../../components/MessageModal.jsx";
import { POLICYHOLDER_STATUS_META } from "../../lib/constants.js";
import { fmtDate, fmtMoney } from "../../lib/helpers.js";

export default function SuperAdminPolicyholders({ policyholders, claims, onToggleStatus, pushToast, onOpenClaim }) {
  const [q, setQ] = useState("");
  const [messaging, setMessaging] = useState(null);

  const rows = policyholders.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase()) || p.policyId.toLowerCase().includes(q.toLowerCase()) || p.email.toLowerCase().includes(q.toLowerCase())
  );

  const claimsFor = (policyId) => claims.filter((c) => c.policyId === policyId);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900">Policyholders</h1>
          <p className="text-ink-500 text-sm mt-1">View accounts, message policyholders, and manage access.</p>
        </div>
        <p className="text-xs text-ink-500">{rows.length} of {policyholders.length} shown</p>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, email, or policy no..." className="input pl-9 max-w-md" />
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {rows.map((p) => {
          const theirClaims = claimsFor(p.policyId);
          const meta = POLICYHOLDER_STATUS_META[p.status];
          return (
            <Card key={p.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display font-semibold text-navy-900 truncate">{p.name}</p>
                  <p className="text-xs text-ink-500 truncate">{p.plan} · {p.policyId}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset shrink-0 ${meta.cls}`}>{meta.label}</span>
              </div>
              <div className="mt-3 space-y-1.5 text-xs text-ink-500">
                <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{p.email}</p>
                <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{p.phone}</p>
                <p>Joined {fmtDate(p.joinedAt)} · {theirClaims.length} claim(s) filed</p>
              </div>
              {theirClaims.length > 0 && (
                <div className="mt-3 pt-3 border-t border-ink-900/6 space-y-1">
                  {theirClaims.slice(0, 2).map((c) => (
                    <button key={c.id} onClick={() => onOpenClaim(c.id)} className="w-full flex items-center justify-between text-xs text-ink-700 hover:text-bearing-600">
                      <span className="flex items-center gap-1.5 truncate"><FileText className="w-3.5 h-3.5 shrink-0" />{c.id} · {c.category}</span>
                      <span className="num shrink-0">{fmtMoney(c.amount)}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button onClick={() => setMessaging(p)} className="btn-ghost flex-1 text-xs py-2"><MessageSquare className="w-3.5 h-3.5" />Message</button>
                <button
                  onClick={() => onToggleStatus(p.id)}
                  className={`flex-1 text-xs py-2 rounded-xl font-semibold inline-flex items-center justify-center gap-1.5 transition ${
                    p.status === "active" ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {p.status === "active" ? <><Ban className="w-3.5 h-3.5" />Suspend</> : <><CheckCircle2 className="w-3.5 h-3.5" />Reactivate</>}
                </button>
              </div>
            </Card>
          );
        })}
        {rows.length === 0 && <p className="text-sm text-ink-500 col-span-2 text-center py-10">No policyholders match your search.</p>}
      </div>

      <MessageModal
        open={!!messaging}
        person={messaging}
        onClose={() => setMessaging(null)}
        onSend={({ subject }) => pushToast({ type: "success", title: `Message sent to ${messaging.name}`, body: subject })}
      />
    </div>
  );
}
