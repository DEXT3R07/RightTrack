import { AlertTriangle, Check, X, Clock } from "lucide-react";
import { slaInfo } from "../lib/helpers.js";
import { SlaBadge } from "./UI.jsx";

export function BearingTracker({ claim }) {
  const steps = [
    { key: "submitted", label: "Submitted" },
    { key: "under_review", label: "Under Review" },
    { key: "action_required", label: "Action Required" },
    { key: "decision", label: claim.status === "rejected" ? "Rejected" : "Decision" },
  ];
  let activeIdx = steps.findIndex((s) => s.key === claim.status);
  if (claim.status === "approved" || claim.status === "rejected") activeIdx = 3;
  const isRejected = claim.status === "rejected";
  const s = slaInfo(claim);

  return (
    <div className="relative">
      {s.breached && (
        <div className="mb-5 rounded-xl bg-red-50 ring-1 ring-red-200 px-4 py-3 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-700">SLA Exceeded → Automatically Escalated to Senior Review</p>
            <p className="text-xs text-red-600 mt-0.5">We're sorry for the delay. A senior adjuster has been assigned to prioritize this claim.</p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Claim Progress</p>
        <SlaBadge claim={claim} />
      </div>
      <div className="relative pt-6 pb-2">
        <div className="absolute left-0 right-0 top-[38px] h-[2px] bg-ink-900/10 mx-5"></div>
        <div
          className="absolute left-0 top-[38px] h-[2px] bg-bearing-600 mx-5 transition-all duration-700"
          style={{ width: `calc(${(Math.min(activeIdx, 3) / 3) * 100}% - ${activeIdx === 0 ? 0 : 40}px)` }}
        ></div>
        <div className="relative grid grid-cols-4">
          {steps.map((st, i) => {
            const done = i < activeIdx || (i === activeIdx && claim.status === "approved");
            const isCurrent = i === activeIdx;
            const failed = isCurrent && isRejected;
            return (
              <div key={st.key} className="flex flex-col items-center text-center px-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ring-4 ring-white z-10 transition-colors
                  ${failed ? "bg-red-600 text-white" : done ? "bg-bearing-600 text-white" : isCurrent ? "bg-white border-2 border-bearing-600 text-bearing-600" : "bg-white border-2 border-ink-900/10 text-ink-300"}`}
                >
                  {failed ? <X className="w-4 h-4" /> : done ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                </div>
                <p className={`mt-2 text-xs font-semibold ${isCurrent ? "text-navy-900" : "text-ink-500"}`}>{st.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function SlaGauge({ claim, size = 96 }) {
  const s = slaInfo(claim);
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  const pct = s.terminal ? 100 : s.pct;
  const color = s.terminal ? "#94a3b8" : s.breached ? "#dc2626" : pct > 75 ? "#d97706" : "#1e4fd9";
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#eef0f6" strokeWidth="7" fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="7" fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c} className="transition-all duration-700"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <Clock className="w-4 h-4" strokeWidth={1.8} />
      </div>
    </div>
  );
}
