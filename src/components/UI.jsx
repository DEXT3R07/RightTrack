import { useEffect } from "react";
import { Check, X, AlertTriangle, Clock, Lock, Sparkles } from "lucide-react";
import { STATUS_META } from "../lib/constants.js";
import { slaInfo } from "../lib/helpers.js";

export function Card({ children, className = "", ...rest }) {
  return (
    <div className={`bg-white rounded-2xl border border-ink-900/8 shadow-card ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function StatusPill({ status }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${m.cls}`}>
      {m.label}
    </span>
  );
}

export function SlaBadge({ claim, compact }) {
  const s = slaInfo(claim);
  if (s.terminal)
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-300">
        <Clock className="w-3.5 h-3.5" />Closed
      </span>
    );
  if (s.breached)
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 ring-1 ring-red-200 px-2 py-1 rounded-full animate-pulsew">
        <AlertTriangle className="w-3.5 h-3.5" />{compact ? "Breached" : "SLA Breached"}
      </span>
    );
  const urgent = s.msLeft < 6 * 3600 * 1000;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ring-1 ${
        urgent ? "text-amber-700 bg-amber-50 ring-amber-200" : "text-bearing-600 bg-bearing-100 ring-bearing-100"
      }`}
    >
      <Clock className="w-3.5 h-3.5" />{s.label}
    </span>
  );
}

export function EmptyState({ icon, title, body, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-2xl bg-navy-50 flex items-center justify-center text-navy-700 mb-4">{icon}</div>
      <p className="font-display font-semibold text-lg text-navy-900">{title}</p>
      <p className="text-ink-500 text-sm mt-1.5 max-w-sm">{body}</p>
      {action}
    </div>
  );
}

export function Modal({ open, onClose, children, wide }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm animate-fadein" onClick={onClose}></div>
      <div className={`relative bg-white rounded-2xl shadow-pop w-full ${wide ? "max-w-2xl" : "max-w-md"} animate-fadein max-h-[90vh] overflow-y-auto`}>
        {children}
      </div>
    </div>
  );
}

export function Toast({ toasts }) {
  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-fadein rounded-xl shadow-pop ring-1 px-4 py-3 text-sm flex items-start gap-2.5 bg-white ${
            t.type === "error" ? "ring-red-200" : t.type === "warn" ? "ring-amber-200" : "ring-emerald-200"
          }`}
        >
          <span
            className={`mt-0.5 shrink-0 rounded-full p-1 ${
              t.type === "error" ? "bg-red-100 text-red-600" : t.type === "warn" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
            }`}
          >
            {t.type === "error" ? <X className="w-3.5 h-3.5" /> : t.type === "warn" ? <AlertTriangle className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
          </span>
          <div>
            <p className="font-semibold text-ink-900">{t.title}</p>
            {t.body && <p className="text-ink-500 mt-0.5">{t.body}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function PremiumBadge({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-brass-500/15 text-brass-600 ${className}`}>
      <Sparkles className="w-2.5 h-2.5" />Premium
    </span>
  );
}

export function PremiumLock({ feature, body, onUpgrade }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 rounded-2xl bg-navy-50/60 border border-dashed border-navy-900/12">
      <div className="w-12 h-12 rounded-2xl bg-navy-900 flex items-center justify-center text-white mb-4"><Lock className="w-5 h-5" /></div>
      <p className="font-display font-semibold text-navy-900 flex items-center gap-2">{feature}<PremiumBadge /></p>
      <p className="text-ink-500 text-sm mt-1.5 max-w-sm">{body}</p>
      <button onClick={onUpgrade} className="btn-primary mt-5 px-5">Upgrade to Premium</button>
    </div>
  );
}

export function Field({ label, children, full }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-semibold text-ink-700 mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

export function Row({ k, v }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-500">{k}</dt>
      <dd className="font-medium text-navy-900">{v}</dd>
    </div>
  );
}
