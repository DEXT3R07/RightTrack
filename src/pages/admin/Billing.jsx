import { useState } from "react";
import { Check, Lock, ShieldCheck, Sparkles, Clock, AlertTriangle, X } from "lucide-react";
import { Card, Modal } from "../../components/UI.jsx";
import PaymentModal from "../../components/PaymentModal.jsx";
import { PLAN_FEATURES, PREMIUM_PRICE, PREMIUM_TRIAL_DAYS, isPremiumPlan } from "../../lib/constants.js";
import { fmtMoney } from "../../lib/helpers.js";

export default function Billing({ plan, onUpgrade, onDowngrade, onStartTrial }) {
  const [cycle, setCycle] = useState("monthly");
  const [checkout, setCheckout] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const isSubscribed = isPremiumPlan(plan);
  const isTrial = plan === "trial";
  const price = PREMIUM_PRICE[cycle];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy-900">Plans &amp; Billing</h1>
        <p className="text-ink-500 text-sm mt-1 max-w-2xl">
          Every adjuster account includes the core claims workspace. Start a {PREMIUM_TRIAL_DAYS}-day free trial to unlock the API, bulk export, and team analytics — cancel anytime.
        </p>
      </div>

      <Card className="p-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSubscribed ? "bg-navy-900 text-white" : "bg-navy-50 text-navy-700"}`}>
            {isTrial ? <Clock className="w-5 h-5" /> : isSubscribed ? <Sparkles className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <p className="font-display font-semibold text-navy-900">
              {isTrial ? `Your ${PREMIUM_TRIAL_DAYS}-day free trial is active` : isSubscribed ? "You're subscribed" : "You're on the free plan"}
            </p>
            <p className="text-xs text-ink-500 mt-0.5">
              {isTrial
                ? "Full access, no charge yet. Cancel anytime before the trial ends and you won't be billed."
                : isSubscribed
                ? `Billed ${cycle === "annual" ? fmtMoney(PREMIUM_PRICE.annual) + " / year" : fmtMoney(PREMIUM_PRICE.monthly) + " / month"}`
                : "Start your free trial any time — no card required, cancel whenever you like."}
            </p>
          </div>
        </div>
        {isSubscribed && (
          <button onClick={() => setConfirmCancel(true)} className="text-xs font-semibold text-red-600 hover:underline">{isTrial ? "Cancel Trial" : "Cancel Subscription"}</button>
        )}
      </Card>

      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-xl bg-navy-50 ring-1 ring-navy-900/8">
          {[["monthly", "Monthly"], ["annual", "Annually"]].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setCycle(k)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${cycle === k ? "bg-navy-900 text-white" : "text-ink-700"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-bearing-100 blur-3xl pointer-events-none"></div>
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-wide text-bearing-600">RightTrack for Adjusters</p>
          <p className="font-display text-3xl font-semibold text-navy-900 mt-2 num">
            {fmtMoney(price)}<span className="text-base text-ink-300 font-medium">/{cycle === "annual" ? "year" : "month"}</span>
          </p>
          <p className="text-xs text-ink-500 mt-1">
            {cycle === "annual" ? `Works out to ${fmtMoney(PREMIUM_PRICE.annual / 12)}/month, billed once a year` : "Billed monthly, cancel any time"} — after your {PREMIUM_TRIAL_DAYS}-day free trial.
          </p>

          <ul className="mt-6 space-y-2.5 text-sm text-ink-700">
            {PLAN_FEATURES.core.map((f) => (
              <li key={f} className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />{f}</li>
            ))}
            {PLAN_FEATURES.subscriberOnly.map((f) => (
              <li key={f} className="flex items-start gap-2">
                {isSubscribed ? <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <Lock className="w-4 h-4 text-ink-300 shrink-0 mt-0.5" />}
                <span className={isSubscribed ? "" : "text-ink-500"}>{f}</span>
                {!isSubscribed && <span className="text-[10px] font-bold uppercase text-bearing-600 bg-bearing-100/70 px-1.5 py-0.5 rounded ml-1">Trial / Subscription</span>}
              </li>
            ))}
          </ul>

          <div className="mt-7">
            {isTrial ? (
              <button onClick={() => setCheckout({ mode: "subscribe" })} className="btn-primary w-full sm:w-auto">
                Add payment — {fmtMoney(price)}/{cycle === "annual" ? "yr" : "mo"} after trial
              </button>
            ) : isSubscribed ? (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 px-4 py-2.5 rounded-xl">
                <Check className="w-4 h-4" />You have full access
              </span>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setCheckout({ mode: "trial" })} className="btn-primary">
                  Start {PREMIUM_TRIAL_DAYS}-day free trial
                </button>
                <button onClick={() => setCheckout({ mode: "subscribe" })} className="btn-ghost">
                  Skip trial — subscribe now
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <p className="text-xs text-ink-400 text-center">
        Prices in Nigerian Naira (₦). {PREMIUM_TRIAL_DAYS}-day free trial, cancel anytime before it ends and you won't be charged. Policy holder accounts are always free.
      </p>

      <PaymentModal
        open={!!checkout}
        onClose={() => setCheckout(null)}
        mode={checkout?.mode}
        cycle={cycle}
        price={price}
        onComplete={() => { if (checkout?.mode === "trial") onStartTrial(); else onUpgrade(cycle); }}
      />

      <Modal open={confirmCancel} onClose={() => setConfirmCancel(false)}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-1">
            <div className="w-11 h-11 rounded-2xl bg-red-50 ring-1 ring-red-200 flex items-center justify-center shrink-0"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
            <button onClick={() => setConfirmCancel(false)} className="p-1.5 -mr-1.5 -mt-1.5 rounded-lg hover:bg-navy-50 text-ink-500"><X className="w-4 h-4" /></button>
          </div>
          <p className="font-display font-semibold text-navy-900 mt-3">{isTrial ? "Cancel your free trial?" : "Cancel your subscription?"}</p>
          <p className="text-sm text-ink-500 mt-1.5">
            {isTrial
              ? "You'll lose access to the API, CSV export, and team analytics right away, and you won't be charged when the trial would have ended."
              : "You'll lose access to the API, CSV export, and team analytics at the end of your current billing period."}
          </p>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setConfirmCancel(false)} className="btn-ghost flex-1">Keep {isTrial ? "Trial" : "Subscription"}</button>
            <button
              onClick={() => { onDowngrade(); setConfirmCancel(false); }}
              className="flex-1 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition px-4 py-2.5"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
