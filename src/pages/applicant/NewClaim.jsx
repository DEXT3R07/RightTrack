import { useState } from "react";
import { Check, ChevronRight, ArrowLeft } from "lucide-react";
import { Card, Field, Row } from "../../components/UI.jsx";
import FileDrop from "../../components/FileDrop.jsx";
import { CATEGORY_META } from "../../lib/constants.js";
import { NOW, fmtMoney, uid } from "../../lib/helpers.js";

export default function NewClaimWizard({ onSubmitClaim, pushToast }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ fullName: "", policyId: "", category: "Health", amount: "", description: "" });
  const [files, setFiles] = useState([]);
  const [refId, setRefId] = useState(null);
  const steps = ["Claim Details", "Upload Documents", "Review & Confirm", "Submit Claim"];

  const canNext1 = form.fullName && form.policyId && form.amount && form.description.length > 10;
  const canNext2 = files.length > 0;

  const submit = () => {
    const ref = uid("CLM");
    onSubmitClaim({
      id: ref, applicant: form.fullName, policyId: form.policyId, category: form.category,
      amount: Number(form.amount), description: form.description, submittedAt: NOW.toISOString(),
      status: "submitted", documents: files,
      history: [
        { ts: NOW.toISOString().replace("Z", ".500000"), label: "Claim submitted", detail: "Submitted by applicant via web portal" },
        { ts: NOW.toISOString().replace("Z", ".812000"), label: "Document validation passed", detail: `${files.length} file(s) verified — format & size checks OK` },
      ],
    });
    setRefId(ref);
    setStep(5);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-navy-900 mb-6">New Claim</h1>
      {step <= 4 && (
        <div className="flex items-center mb-8">
          {steps.map((s, i) => (
            <div key={s} className="contents">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    i + 1 < step ? "bg-emerald-500 text-white" : i + 1 === step ? "bg-bearing-600 text-white" : "bg-white ring-2 ring-ink-900/10 text-ink-300"
                  }`}
                >
                  {i + 1 < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[11px] font-semibold hidden sm:block ${i + 1 <= step ? "text-navy-900" : "text-ink-300"}`}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-[2px] mx-2 ${i + 1 < step ? "bg-emerald-500" : "bg-ink-900/10"}`}></div>}
            </div>
          ))}
        </div>
      )}

      {step === 1 && (
        <Card className="p-6">
          <p className="font-display font-semibold text-navy-900">Claim Details</p>
          <p className="text-xs text-ink-500 mt-1 mb-5">Please provide the details of your claim.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name"><input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="e.g. Dexter Echo" className="input" /></Field>
            <Field label="Entity / Policy ID"><input value={form.policyId} onChange={(e) => setForm({ ...form, policyId: e.target.value })} placeholder="e.g. LDW/2026/12345" className="input" /></Field>
            <Field label="Claim Category">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
                {Object.keys(CATEGORY_META).map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Claim Amount (₦)"><input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="250000" className="input" /></Field>
            <Field label="Description of Claim" full>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="What happened? Please provide as much detail as possible." className="input resize-none" />
            </Field>
          </div>
          <div className="flex justify-end mt-6">
            <button disabled={!canNext1} onClick={() => setStep(2)} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">Continue <ChevronRight className="w-4 h-4" /></button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="p-6">
          <p className="font-display font-semibold text-navy-900">Upload Supporting Documents</p>
          <p className="text-xs text-ink-500 mt-1 mb-5">Please upload all relevant documents that support your claim.</p>
          <FileDrop files={files} setFiles={setFiles} pushToast={pushToast} />
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(1)} className="btn-ghost"><ArrowLeft className="w-4 h-4" /> Back</button>
            <button disabled={!canNext2} onClick={() => setStep(3)} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">Continue <ChevronRight className="w-4 h-4" /></button>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card className="p-6">
          <p className="font-display font-semibold text-navy-900">Review your claim</p>
          <p className="text-xs text-ink-500 mt-1 mb-5">Please review all details before submitting.</p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold uppercase text-ink-500 mb-2">Claim Details</p>
              <dl className="text-sm space-y-2">
                <Row k="Full Name" v={form.fullName} /><Row k="Policy ID" v={form.policyId} /><Row k="Category" v={form.category} />
                <Row k="Amount" v={fmtMoney(form.amount || 0)} />
              </dl>
              <p className="text-xs font-bold uppercase text-ink-500 mt-4 mb-1.5">Description</p>
              <p className="text-sm text-ink-700 leading-relaxed">{form.description}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-ink-500 mb-2">Uploaded Documents</p>
              <div className="space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-navy-50/60 text-sm">
                    <span className="flex-1 truncate">{f.name}</span><span className="text-xs text-ink-500">{f.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-5 text-xs bg-bearing-100 text-bearing-700 rounded-lg px-3.5 py-2.5">You can go back to edit any section before final submission.</div>
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(2)} className="btn-ghost"><ArrowLeft className="w-4 h-4" /> Back</button>
            <button onClick={() => setStep(4)} className="btn-primary">Continue <ChevronRight className="w-4 h-4" /></button>
          </div>
        </Card>
      )}

      {step === 4 && (
        <Card className="p-6">
          <p className="font-display font-semibold text-navy-900">Submit your claim</p>
          <p className="text-xs text-ink-500 mt-1 mb-5">You're almost done. Confirm below to submit your claim for review.</p>
          <div className="space-y-3">
            {[
              ["We'll review your claim", "Our team reviews your submitted information."],
              ["You'll be updated", "Real-time updates as your claim status changes."],
              ["Clarification if needed", "We'll ask if we need more information."],
              ["Final decision", "You'll be notified once a decision is made."],
            ].map(([t, d], i) => (
              <div key={t} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[11px] font-bold shrink-0">{i + 1}</span>
                <div><p className="text-sm font-semibold text-navy-900">{t}</p><p className="text-xs text-ink-500">{d}</p></div>
              </div>
            ))}
          </div>
          <div className="mt-5 text-xs bg-bearing-100 text-bearing-700 rounded-lg px-3.5 py-2.5">By submitting, you confirm that all information provided is accurate and documents are genuine.</div>
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(3)} className="btn-ghost"><ArrowLeft className="w-4 h-4" /> Back</button>
            <button onClick={submit} className="btn-primary">Submit Claim</button>
          </div>
        </Card>
      )}

      {step === 5 && (
        <Card className="p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto"><Check className="w-6 h-6" /></div>
          <p className="font-display text-xl font-semibold text-navy-900 mt-4">Claim Submitted Successfully!</p>
          <p className="text-sm text-ink-500 mt-1">Your claim has been received and is now being processed.</p>
          <div className="grid grid-cols-3 gap-4 mt-6 max-w-md mx-auto">
            <div><p className="text-[11px] text-ink-500">Reference ID</p><p className="font-mono font-semibold text-navy-900 text-sm">{refId}</p></div>
            <div><p className="text-[11px] text-ink-500">Status</p><p className="font-semibold text-emerald-600 text-sm">Submitted</p></div>
            <div><p className="text-[11px] text-ink-500">Est. Resolution</p><p className="font-semibold text-navy-900 text-sm">≤ 48 hours</p></div>
          </div>
          <button onClick={() => onSubmitClaim(null, refId)} className="btn-primary mt-7">Track My Claim</button>
        </Card>
      )}
    </div>
  );
}
