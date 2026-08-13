import { useState } from "react";
import { ArrowLeft, AlertTriangle, Layers, FileText, ZoomIn, X } from "lucide-react";
import { Card, Row } from "../../components/UI.jsx";
import { StatusPill, SlaBadge, Modal } from "../../components/UI.jsx";
import { BearingTracker, SlaGauge } from "../../components/BearingTracker.jsx";
import CompassDial from "../../components/CompassDial.jsx";
import AuditDrawer from "../../components/AuditDrawer.jsx";
import { CATEGORY_META, STATUS_META, REJECTION_CODES } from "../../lib/constants.js";
import { slaInfo, fmtDateTime, fmtMoney } from "../../lib/helpers.js";

export default function ClaimReview({ claim, onBack, onDecision, onRequestInfo, pushToast, readOnly = false }) {
  const [drawer, setDrawer] = useState(false);
  const [decision, setDecision] = useState(null);
  const [rejectCode, setRejectCode] = useState(REJECTION_CODES[0]);
  const [notes, setNotes] = useState("");
  const [activeDoc, setActiveDoc] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const activeDocument = claim.documents[activeDoc];
  const s = slaInfo(claim);
  const cat = CATEGORY_META[claim.category];
  const terminal = claim.status === "approved" || claim.status === "rejected";

  const submitDecision = () => {
    if (decision === "reject" && !notes.trim()) { pushToast({ type: "error", title: "Notes required", body: "Add notes explaining the rejection." }); return; }
    if (decision === "info" && !notes.trim()) { pushToast({ type: "error", title: "Notes required", body: "Describe what's needed from the applicant." }); return; }
    if (decision === "approve") onDecision(claim.id, "approved", { notes });
    else if (decision === "reject") onDecision(claim.id, "rejected", { rejectionCode: rejectCode, notes });
    else if (decision === "info") onRequestInfo(claim.id, notes);
    setDecision(null); setNotes("");
  };

  return (
    <div>
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-navy-900 mb-5"><ArrowLeft className="w-4 h-4" />Back to Queue</button>

      <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-display text-2xl font-semibold text-navy-900">{claim.id}</h1>
            <StatusPill status={claim.status} />
            <span className="text-xs font-bold px-2 py-1 rounded-md" style={{ background: cat.bg, color: cat.color }}>{claim.category}</span>
          </div>
          <p className="text-sm text-ink-500 mt-1">Submitted {fmtDateTime(claim.submittedAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          {s.breached && <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-red-700 bg-red-50 ring-1 ring-red-200 px-3 py-1.5 rounded-full animate-pulsew"><AlertTriangle className="w-4 h-4" />SLA BREACHED / ESCALATED</span>}
          <button onClick={() => setDrawer(true)} className="btn-ghost text-sm"><Layers className="w-4 h-4" />Audit Log</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-5">
          <Card className="p-5">
            <p className="font-display font-semibold text-navy-900 mb-4">Applicant Profile</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-navy-100 text-navy-700 flex items-center justify-center font-semibold">{claim.applicant.split(" ").map((n) => n[0]).join("")}</div>
              <div><p className="font-semibold text-navy-900 text-sm">{claim.applicant}</p><p className="text-xs text-ink-500">{claim.policyId}</p></div>
            </div>
            <dl className="text-sm space-y-2.5">
              <Row k="Claim Category" v={claim.category} />
              <Row k="Claim Amount" v={fmtMoney(claim.amount)} />
              <Row k="Policy Number" v={claim.policyId} />
              <Row k="Submitted" v={fmtDateTime(claim.submittedAt)} />
            </dl>
            <div className="mt-4 pt-4 border-t border-ink-900/6">
              <p className="text-xs font-bold uppercase text-ink-500 mb-1.5">Description</p>
              <p className="text-sm text-ink-700 leading-relaxed">{claim.description}</p>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between mb-1">
              <p className="font-display font-semibold text-navy-900">SLA Status</p>
              <SlaGauge claim={claim} size={44} />
            </div>
            <SlaBadge claim={claim} />
            <p className="text-xs text-ink-500 mt-2">Deadline: {fmtDateTime(s.deadline)}</p>
          </Card>
          <Card className="p-5">
            <p className="font-display font-semibold text-navy-900 mb-3">Claim Progress</p>
            <BearingTracker claim={claim} />
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-display font-semibold text-navy-900">Uploaded Documents ({claim.documents.length})</p>
              {activeDocument?.url && (
                <button onClick={() => setLightbox(true)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-bearing-600 hover:underline">
                  <ZoomIn className="w-3.5 h-3.5" />Zoom
                </button>
              )}
            </div>
            <div className="rounded-xl bg-navy-950 aspect-[4/3] flex flex-col items-center justify-center text-navy-100/50 relative overflow-hidden mb-3">
              {activeDocument?.url ? (
                <button onClick={() => setLightbox(true)} className="absolute inset-0 group cursor-zoom-in">
                  <img src={activeDocument.url} alt={activeDocument.name} className="w-full h-full object-contain bg-navy-950" />
                  <span className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/20 transition flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition" />
                  </span>
                  <span className="absolute bottom-0 inset-x-0 bg-navy-950/80 px-3 py-2 text-left">
                    <span className="text-xs text-white font-medium block truncate">{activeDocument.name}</span>
                    <span className="text-[11px] text-navy-100/60">{activeDocument.size} · Click to zoom</span>
                  </span>
                </button>
              ) : (
                <>
                  <CompassDial className="compass-ticks absolute -right-16 -bottom-16 w-56 h-56" />
                  <FileText className="w-10 h-10 relative" />
                  <p className="text-sm mt-3 relative font-medium">{activeDocument?.name}</p>
                  <p className="text-xs mt-1 relative">{activeDocument?.size} · No inline preview for this file type</p>
                </>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-none">
              {claim.documents.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDoc(i)}
                  className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border ${activeDoc === i ? "border-bearing-600 bg-bearing-100 text-bearing-700" : "border-ink-900/8 text-ink-600 hover:bg-navy-50"}`}
                >
                  {d.url ? <img src={d.url} alt="" className="w-3.5 h-3.5 rounded-sm object-cover" /> : <FileText className="w-3.5 h-3.5" />}
                  {d.name}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <p className="font-display font-semibold text-navy-900 mb-4">Decision Controls</p>
            {readOnly ? (
              <div className="rounded-xl bg-navy-50 px-4 py-4 text-sm text-ink-600">
                Super Admin has view-only access to claim decisions. Current status: <span className="font-semibold text-navy-900">{STATUS_META[claim.status].label}</span>.
                {claim.status === "rejected" && <p className="mt-1 text-xs text-ink-500">Code: {claim.rejectionCode}</p>}
                <p className="mt-2 text-xs text-ink-500">To act on this claim, message the assigned adjuster from the Adjusters page.</p>
              </div>
            ) : terminal ? (
              <div className="rounded-xl bg-navy-50 px-4 py-4 text-sm text-ink-600">
                This claim is closed with a final decision: <span className="font-semibold text-navy-900">{STATUS_META[claim.status].label}</span>.
                {claim.status === "rejected" && <p className="mt-1 text-xs text-ink-500">Code: {claim.rejectionCode}</p>}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button onClick={() => setDecision("approve")} className={`py-2.5 rounded-xl text-sm font-semibold border transition ${decision === "approve" ? "bg-emerald-600 text-white border-emerald-600" : "border-ink-900/10 text-ink-700 hover:border-emerald-400"}`}>Approve</button>
                  <button onClick={() => setDecision("reject")} className={`py-2.5 rounded-xl text-sm font-semibold border transition ${decision === "reject" ? "bg-red-600 text-white border-red-600" : "border-ink-900/10 text-ink-700 hover:border-red-400"}`}>Reject</button>
                  <button onClick={() => setDecision("info")} className={`py-2.5 rounded-xl text-sm font-semibold border transition ${decision === "info" ? "bg-amber-500 text-white border-amber-500" : "border-ink-900/10 text-ink-700 hover:border-amber-400"}`}>Request Info</button>
                </div>
                {decision === "reject" && (
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-ink-700 mb-1.5 block">Rejection Code</span>
                    <select value={rejectCode} onChange={(e) => setRejectCode(e.target.value)} className="input">{REJECTION_CODES.map((c) => <option key={c}>{c}</option>)}</select>
                  </div>
                )}
                {decision && (
                  <>
                    <span className="text-xs font-semibold text-ink-700 mb-1.5 block">{decision === "approve" ? "Notes (optional)" : "Notes (required)"}</span>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="input resize-none" placeholder="Add context for the applicant and audit record..." />
                    <div className="flex justify-end gap-2 mt-3">
                      <button onClick={() => { setDecision(null); setNotes(""); }} className="btn-ghost">Cancel</button>
                      <button onClick={submitDecision} className="btn-primary">Submit Decision</button>
                    </div>
                  </>
                )}
              </>
            )}
          </Card>
        </div>
      </div>

      <AuditDrawer open={drawer} onClose={() => setDrawer(false)} claim={claim} />

      <Modal open={lightbox && !!activeDocument?.url} onClose={() => setLightbox(false)} wide>
        {activeDocument?.url && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3 px-1.5">
              <div>
                <p className="font-semibold text-navy-900 text-sm">{activeDocument.name}</p>
                <p className="text-xs text-ink-500">{activeDocument.size}</p>
              </div>
              <button onClick={() => setLightbox(false)} className="p-2 rounded-lg hover:bg-navy-50 text-ink-400"><X className="w-5 h-5" /></button>
            </div>
            <img src={activeDocument.url} alt={activeDocument.name} className="w-full max-h-[75vh] object-contain rounded-xl bg-navy-950" />
          </div>
        )}
      </Modal>
    </div>
  );
}
