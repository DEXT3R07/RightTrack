import { X, Shield } from "lucide-react";
import { fmtClock, fmtDate } from "../lib/helpers.js";

export default function AuditDrawer({ open, onClose, claim }) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div className={`absolute inset-0 bg-navy-950/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose}></div>
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-pop transition-transform duration-300 flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="px-6 h-16 border-b border-ink-900/6 flex items-center justify-between shrink-0">
          <div>
            <p className="font-display font-semibold text-navy-900">Immutable Audit Log</p>
            <p className="text-xs text-ink-500">{claim?.id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-navy-50 text-ink-500"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="relative pl-6">
            <div className="absolute left-[7px] top-1 bottom-1 w-px bg-ink-900/10"></div>
            {claim && claim.history.map((h, i) => (
              <div key={i} className="relative pb-6 last:pb-0">
                <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-bearing-600 ring-4 ring-white"></span>
                <p className="font-semibold text-sm text-navy-900">{h.label}</p>
                <p className="text-xs text-ink-500 mt-0.5 leading-relaxed">{h.detail}</p>
                <p className="text-[11px] font-mono text-ink-300 mt-1">{fmtClock(h.ts)} · {fmtDate(h.ts)}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[11px] text-ink-300 bg-navy-50/70 rounded-lg px-3 py-2.5 flex items-start gap-2">
            <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" /> This record is cryptographically timestamped and cannot be edited or deleted, per compliance policy.
          </div>
        </div>
      </div>
    </div>
  );
}
