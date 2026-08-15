import { useState, useEffect } from "react";
import { CreditCard, Lock, Check, Loader2, X, ShieldCheck } from "lucide-react";
import { Modal, Field } from "./UI.jsx";
import { fmtMoney } from "../lib/helpers.js";
import { PREMIUM_TRIAL_DAYS } from "../lib/constants.js";

const emptyCard = { name: "", number: "", expiry: "", cvv: "" };

function formatCardNumber(v) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export default function PaymentModal({ open, onClose, mode, cycle, price, onComplete }) {
  const [step, setStep] = useState("details");
  const [card, setCard] = useState(emptyCard);

  useEffect(() => {
    if (open) { setStep("details"); setCard(emptyCard); }
  }, [open]);

  useEffect(() => {
    if (step !== "processing") return;
    const t = setTimeout(() => { onComplete(); setStep("success"); }, 1600);
    return () => clearTimeout(t);
  }, [step]);

  if (!open) return null;

  const isTrial = mode === "trial";
  const dueToday = isTrial ? 0 : price;
  const canPay = card.name.trim().length > 1 && card.number.replace(/\s/g, "").length === 16 && /^\d{2}\/\d{2}$/.test(card.expiry) && card.cvv.length >= 3;

  const handlePay = (e) => {
    e.preventDefault();
    if (!canPay) return;
    setStep("processing");
  };

  return (
    <Modal open={open} onClose={step === "processing" ? () => {} : onClose}>
      <div className="p-6">
        {step === "details" && (
          <>
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-navy-900 text-white flex items-center justify-center shrink-0"><CreditCard className="w-4.5 h-4.5" /></div>
                <div>
                  <p className="font-display font-semibold text-navy-900">{isTrial ? "Start your free trial" : "Subscribe to Premium"}</p>
                  <p className="text-xs text-ink-500">Secured checkout — RightTrack Pay</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 -mr-1.5 -mt-1.5 rounded-lg hover:bg-navy-50 text-ink-500"><X className="w-4 h-4" /></button>
            </div>

            <div className="rounded-xl bg-navy-50/70 ring-1 ring-navy-900/6 px-4 py-3 mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-navy-900">{isTrial ? `${PREMIUM_TRIAL_DAYS}-day free trial` : `Premium — ${cycle === "annual" ? "Annual" : "Monthly"}`}</p>
                <p className="text-xs text-ink-500">
                  {isTrial ? `Then ${fmtMoney(price)}/${cycle === "annual" ? "yr" : "mo"} unless you cancel` : cycle === "annual" ? "Billed once a year" : "Billed monthly"}
                </p>
              </div>
              <p className="font-display font-semibold text-navy-900 num shrink-0">{fmtMoney(dueToday)} <span className="text-xs text-ink-400 font-normal">today</span></p>
            </div>

            <form className="space-y-4 mt-5" onSubmit={handlePay}>
              <Field label="Cardholder Name">
                <input className="input" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} placeholder="Name on card" required />
              </Field>
              <Field label="Card Number">
                <input className="input" value={card.number} onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })} placeholder="0000 0000 0000 0000" inputMode="numeric" required />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Expiry">
                  <input className="input" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} placeholder="MM/YY" inputMode="numeric" required />
                </Field>
                <Field label="CVV">
                  <input className="input" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="•••" inputMode="numeric" required />
                </Field>
              </div>
              <button type="submit" disabled={!canPay} className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />{isTrial ? "Start Free Trial" : `Pay ${fmtMoney(dueToday)}`}
              </button>
              <p className="text-[11px] text-ink-400 text-center inline-flex items-center justify-center gap-1 w-full"><ShieldCheck className="w-3 h-3 shrink-0" />This is a demo checkout — no real charge is made.</p>
            </form>
          </>
        )}

        {step === "processing" && (
          <div className="py-14 flex flex-col items-center text-center">
            <Loader2 className="w-9 h-9 text-bearing-600 animate-spin mb-4" />
            <p className="font-display font-semibold text-navy-900">Processing payment…</p>
            <p className="text-xs text-ink-500 mt-1">Talking to RightTrack Pay — don't close this window.</p>
          </div>
        )}

        {step === "success" && (
          <div className="py-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 ring-1 ring-emerald-200 flex items-center justify-center mb-4">
              <Check className="w-7 h-7 text-emerald-600" />
            </div>
            <p className="font-display font-semibold text-navy-900">{isTrial ? "Trial activated" : "Payment successful"}</p>
            <p className="text-sm text-ink-500 mt-1 max-w-xs">
              {isTrial ? `Your ${PREMIUM_TRIAL_DAYS}-day free trial is now active.` : "Your Premium subscription is now active."}
            </p>
            <button onClick={onClose} className="btn-primary mt-6 px-6">Continue</button>
          </div>
        )}
      </div>
    </Modal>
  );
}
