import { useState } from "react";
import { Check, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { Card } from "../../components/UI.jsx";
import { PLAN_FEATURES, PREMIUM_PRICE } from "../../lib/constants.js";
import { fmtMoney } from "../../lib/helpers.js";

export default function Billing({ plan, onUpgrade, onDowngrade }) {
  const [cycle, setCycle] = useState("monthly");
  const isPremium = plan === "premium";
  const price = PREMIUM_PRICE[cycle];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy-900">Plans &amp; Billing</h1>
        <p className="text-ink-500 text-sm mt-1 max-w-2xl">
          Adjuster accounts start on the free Standard plan. Upgrade to Premium to unlock the API, bulk data export, and team analytics.
        </p>
      </div>

      <Card className="p-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPremium ? "bg-navy-900 text-white" : "bg-navy-50 text-navy-700"}`}>
            {isPremium ? <Sparkles className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <p className="font-display font-semibold text-navy-900">You're currently on {isPremium ? "Premium" : "Standard (Free)"}</p>
            <p className="text-xs text-ink-500 mt-0.5">{isPremium ? `Billed ${cycle === "annual" ? fmtMoney(PREMIUM_PRICE.annual) + " / year" : fmtMoney(PREMIUM_PRICE.monthly) + " / month"}` : "Upgrade any time — no long-term commitment on the monthly plan."}</p>
          </div>
        </div>
        {isPremium && (
          <button onClick={onDowngrade} className="text-xs font-semibold text-red-600 hover:underline">Cancel Premium</button>
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

      <div className="grid sm:grid-cols-2 gap-5">
        <Card className="p-6 flex flex-col">
          <p className="font-display font-semibold text-navy-900">Standard</p>
          <p className="text-xs text-ink-500 mt-1">For adjusters getting started with the claims workspace.</p>
          <p className="font-display text-3xl font-semibold text-navy-900 mt-4 num">₦0</p>
          <p className="text-xs text-ink-500">Free, forever</p>
          <ul className="mt-5 space-y-2.5 text-sm text-ink-700 flex-1">
            {PLAN_FEATURES.free.map((f) => (
              <li key={f} className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />{f}</li>
            ))}
            {["API key generation & webhook access", "CSV / bulk data export"].map((f) => (
              <li key={f} className="flex items-start gap-2 text-ink-300"><Lock className="w-4 h-4 shrink-0 mt-0.5" />{f}</li>
            ))}
          </ul>
          <button disabled className="w-full mt-6 py-2.5 rounded-xl text-sm font-semibold bg-ink-900/5 text-ink-400 cursor-not-allowed">
            {isPremium ? "Included" : "Current Plan"}
          </button>
        </Card>

        <Card className="p-6 flex flex-col ring-2 ring-bearing-600 relative overflow-hidden">
          <span className="absolute top-0 right-0 text-[10px] font-bold uppercase tracking-wide bg-bearing-600 text-white px-3 py-1 rounded-bl-xl">Most Capable</span>
          <p className="font-display font-semibold text-navy-900">Premium</p>
          <p className="text-xs text-ink-500 mt-1">For adjusters and teams who integrate RightTrack into their own systems.</p>
          <p className="font-display text-3xl font-semibold text-navy-900 mt-4 num">
            {fmtMoney(price)}<span className="text-base text-ink-300 font-medium">/{cycle === "annual" ? "year" : "month"}</span>
          </p>
          <p className="text-xs text-ink-500">{cycle === "annual" ? `Works out to ${fmtMoney(PREMIUM_PRICE.annual / 12)}/month, billed once a year` : "Billed monthly, cancel any time"}</p>
          <ul className="mt-5 space-y-2.5 text-sm text-ink-700 flex-1">
            {PLAN_FEATURES.premium.map((f) => (
              <li key={f} className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />{f}</li>
            ))}
          </ul>
          {isPremium ? (
            <button disabled className="w-full mt-6 py-2.5 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-700 cursor-default">Current Plan</button>
          ) : (
            <button onClick={() => onUpgrade(cycle)} className="btn-primary w-full mt-6">
              Upgrade — {fmtMoney(price)}/{cycle === "annual" ? "yr" : "mo"}
            </button>
          )}
        </Card>
      </div>

      <p className="text-xs text-ink-400 text-center">Prices in Nigerian Naira (₦). Policy holder accounts are always free.</p>
    </div>
  );
}
