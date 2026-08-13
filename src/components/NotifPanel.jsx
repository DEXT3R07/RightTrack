import { AlertTriangle, Check } from "lucide-react";
import { slaInfo } from "../lib/helpers.js";

export default function NotifPanel({ open, onClose, claims }) {
  const notifs = [];
  claims.forEach((c) => {
    const s = slaInfo(c);
    if (s.breached) notifs.push({ id: c.id + "-b", icon: "alert", title: `${c.id} — SLA breached`, body: "Escalated to senior review.", time: "Just now" });
    if (c.status === "action_required") notifs.push({ id: c.id + "-a", icon: "warn", title: `${c.id} — action required`, body: c.flagReason, time: "2h ago" });
    if (c.status === "approved") notifs.push({ id: c.id + "-ok", icon: "ok", title: `${c.id} — approved`, body: "Decision recorded.", time: "1d ago" });
  });
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="absolute right-4 sm:right-8 top-16 w-[22rem] max-h-[70vh] overflow-y-auto bg-white rounded-2xl shadow-pop ring-1 ring-ink-900/8 animate-fadein"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-ink-900/6 font-display font-semibold text-navy-900">Notifications</div>
        <div className="divide-y divide-ink-900/6">
          {notifs.length === 0 && <p className="text-sm text-ink-500 text-center py-8">You're all caught up.</p>}
          {notifs.map((n) => (
            <div key={n.id} className="px-4 py-3 flex gap-3 hover:bg-navy-50/50">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.icon === "alert" ? "bg-red-100 text-red-600" : n.icon === "warn" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"}`}>
                {n.icon === "ok" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy-900">{n.title}</p>
                <p className="text-xs text-ink-500 truncate">{n.body}</p>
                <p className="text-[11px] text-ink-300 mt-0.5">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
