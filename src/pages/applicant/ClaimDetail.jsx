import { useState } from "react";
import { ArrowLeft, Download, AlertTriangle, Check, Upload, FileText } from "lucide-react";
import { Card } from "../../components/UI.jsx";
import { BearingTracker } from "../../components/BearingTracker.jsx";
import FileDrop from "../../components/FileDrop.jsx";
import RatingModal from "./RatingModal.jsx";
import { CATEGORY_META } from "../../lib/constants.js";
import { fmtDateTime, fmtMoney } from "../../lib/helpers.js";

export default function ClaimDetailApplicant({ claim, onBack, onReupload, onRate, pushToast }) {
  const [showRating, setShowRating] = useState((claim.status === "approved" || claim.status === "rejected") && !claim.rating);
  const [reFiles, setReFiles] = useState([]);
  const cat = CATEGORY_META[claim.category];

  return (
    <div className="max-w-4xl">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-navy-900 mb-5"><ArrowLeft className="w-4 h-4" />Back to Dashboard</button>

      <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-semibold text-navy-900">{claim.id}</h1>
            <span className="text-xs font-bold px-2 py-1 rounded-md" style={{ background: cat.bg, color: cat.color }}>{claim.category}</span>
          </div>
          <p className="text-sm text-ink-500 mt-1">{claim.applicant} · {claim.policyId}</p>
        </div>
        <button className="btn-ghost text-sm"><Download className="w-4 h-4" />Download Report</button>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 my-5">
        <Card className="p-4"><p className="text-[11px] text-ink-500">Submitted On</p><p className="font-semibold text-navy-900 text-sm mt-0.5">{fmtDateTime(claim.submittedAt)}</p></Card>
        <Card className="p-4"><p className="text-[11px] text-ink-500">Policy Number</p><p className="font-semibold text-navy-900 text-sm mt-0.5">{claim.policyId}</p></Card>
        <Card className="p-4"><p className="text-[11px] text-ink-500">Claim Amount</p><p className="font-semibold text-navy-900 text-sm mt-0.5 num">{fmtMoney(claim.amount)}</p></Card>
      </div>

      <Card className="p-6">
        <BearingTracker claim={claim} />
        <div className="mt-8 pt-6 border-t border-ink-900/6">
          {claim.status === "action_required" && (
            <div className="rounded-xl bg-rose-50 ring-1 ring-rose-200 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-rose-700 text-sm">More action required</p>
                  <p className="text-sm text-rose-600 mt-1">{claim.flagReason}</p>
                </div>
              </div>
              <div className="mt-4">
                <FileDrop files={reFiles} setFiles={setReFiles} pushToast={pushToast} />
                <button disabled={!reFiles.length} onClick={() => onReupload(claim.id, reFiles)} className="btn-primary mt-3 disabled:opacity-40">
                  <Upload className="w-4 h-4" /> Submit Updated Document
                </button>
                <p className="text-xs text-ink-500 mt-2">Re-uploading keeps your place in the review queue — no need to resubmit the whole claim.</p>
              </div>
            </div>
          )}
          {claim.status === "approved" && (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto"><Check className="w-5 h-5" /></div>
              <p className="font-semibold text-navy-900 mt-3">Claim Approved</p>
              <p className="text-sm text-ink-500 mt-1">Payment will be processed to your registered account within 24 hours.</p>
            </div>
          )}
          {claim.status === "rejected" && (
            <div className="rounded-xl bg-red-50 ring-1 ring-red-200 p-5">
              <p className="font-semibold text-red-700 text-sm">Reason for rejection</p>
              <p className="text-sm text-red-600 mt-1"><strong>{claim.rejectionCode}.</strong> {claim.rejectionNotes}</p>
              <p className="text-xs text-ink-500 mt-3">Contact support if you believe this decision was made in error.</p>
            </div>
          )}
          {(claim.status === "submitted" || claim.status === "under_review") && (
            <p className="text-sm text-ink-500 text-center py-4">
              {claim.status === "submitted" ? "We've received your claim and will begin review shortly." : "Our team is reviewing your claim and will update you shortly."}
            </p>
          )}
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 gap-5 mt-5">
        <Card className="p-5">
          <p className="font-display font-semibold text-navy-900 mb-3">Description</p>
          <p className="text-sm text-ink-700 leading-relaxed">{claim.description}</p>
        </Card>
        <Card className="p-5">
          <p className="font-display font-semibold text-navy-900 mb-3">Documents ({claim.documents.length})</p>
          <div className="space-y-2">
            {claim.documents.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-navy-50/60 text-sm">
                {f.url ? <img src={f.url} alt="" className="w-4 h-4 rounded-sm object-cover" /> : <FileText className="w-4 h-4 text-bearing-600" />}
                <span className="flex-1 truncate">{f.name}</span><span className="text-xs text-ink-500">{f.size}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {claim.rating && (
        <Card className="p-5 mt-5">
          <p className="font-display font-semibold text-navy-900 mb-2">Your Rating</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className={n <= claim.rating.stars ? "text-brass-500" : "text-ink-900/15"}>
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill={n <= claim.rating.stars ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8"><path d="m12 2.5 2.9 6.3 6.8.7-5.1 4.6 1.5 6.8L12 17.6l-6.1 3.3 1.5-6.8L2.3 9.5l6.8-.7Z" /></svg>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">{claim.rating.tags.map((t) => <span key={t} className="text-[11px] font-semibold bg-navy-50 text-navy-700 px-2 py-1 rounded-full">{t}</span>)}</div>
          {claim.rating.review && <p className="text-sm text-ink-600 mt-2 italic">"{claim.rating.review}"</p>}
        </Card>
      )}

      <RatingModal open={showRating} onClose={() => setShowRating(false)} onSubmit={(r) => { onRate(claim.id, r); setShowRating(false); }} />
    </div>
  );
}
