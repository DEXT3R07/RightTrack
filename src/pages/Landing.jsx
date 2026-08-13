import { useEffect, useState } from "react";
import { Compass, Layers, Clock, Upload, AlertTriangle, Shield, Webhook, Check } from "lucide-react";
import CompassDial from "../components/CompassDial.jsx";
import Reveal from "../components/Reveal.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { useReveal, useScrollY } from "../hooks/useReveal.js";

function AnimatedStat({ target, suffix = "", label, duration = 1200 }) {
  const [ref, inView] = useReveal({ threshold: 0.6 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const isFloat = target % 1 !== 0;
    let frame;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(isFloat ? +(target * eased).toFixed(1) : Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, duration]);

  return (
    <div ref={ref}>
      <p className="font-display text-2xl text-white font-semibold num">{value}{suffix}</p>
      <p className="text-navy-100/50 text-xs mt-1">{label}</p>
    </div>
  );
}

export default function Landing({ onGetStarted, onExploreAdmin, scrollTarget, onScrolled }) {
  const scrollY = useScrollY();

  useEffect(() => {
    if (!scrollTarget) return;
    const el = document.getElementById(scrollTarget);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    onScrolled?.();
  }, [scrollTarget, onScrolled]);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0">
          <img
            src="/bg-compass.jpg"
            alt=""
            className="w-full h-full object-cover transition-transform duration-300 ease-out"
            style={{ transform: `scale(1.08) translateY(${scrollY * 0.08}px)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/90 via-navy-950/90 to-navy-950/95" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-28 text-center">
          <Reveal className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brass-400 bg-white/5 ring-1 ring-white/10 px-3.5 py-1.5 rounded-full mb-7">
            <Compass className="w-3.5 h-3.5" /> Claims &amp; Requests Status Tracking
          </Reveal>
          <Reveal as="h1" delay={80} className="font-display text-4xl sm:text-6xl font-semibold text-white leading-[1.08] tracking-tight max-w-3xl mx-auto">
            Every claim, on a fixed bearing to resolution.
          </Reveal>
          <Reveal delay={160} className="text-navy-100/70 text-lg mt-6 max-w-xl mx-auto leading-relaxed">
            RightTrack replaces opaque claim queues with a live, SLA-governed pipeline — so applicants always know where they stand, and reviewers never miss a deadline.
          </Reveal>
          <Reveal delay={240} className="mt-9 flex items-center justify-center gap-3">
            <button onClick={onGetStarted} className="bg-bearing-600 hover:bg-bearing-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-pop transition hover:-translate-y-0.5">Submit a Claim</button>
            <button onClick={onExploreAdmin} className="bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-3.5 rounded-xl ring-1 ring-white/15 transition hover:-translate-y-0.5">Open Adjuster Console</button>
          </Reveal>
          <div className="mt-16 grid grid-cols-3 max-w-lg mx-auto gap-6 text-left">
            <AnimatedStat target={48} suffix="hr" label="SLA response window" />
            <AnimatedStat target={99.2} suffix="%" label="On-time resolution" />
            <AnimatedStat target={24} suffix="/7" label="Live status tracking" />
          </div>
        </div>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <Reveal className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-bearing-600">Features</p>
          <h2 className="font-display text-3xl font-semibold text-navy-900 mt-2">Built around one deadline: 48 hours.</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {[
            [Layers, "Live progress pipeline", "A step-by-step tracker moves from Submitted to Decision, visible to applicant and reviewer alike."],
            [Clock, "Real-time SLA countdown", "Every claim carries a live 48-hour clock. Breach it, and the claim auto-escalates to senior review."],
            [Upload, "Guided document validation", "Drag-and-drop upload checks format and size instantly, before the claim ever reaches a reviewer."],
            [AlertTriangle, "Clarification loop", "Flagged claims get a single, focused re-upload path — no lost queue position, no restarting."],
            [Shield, "Immutable audit trail", "Every view, flag, and decision is timestamped and locked — a full record for compliance."],
            [Webhook, "API & webhooks", "Push claim events into your CRM, core insurance system, or partner portal in real time."],
          ].map(([Icon, t, d], i) => (
            <Reveal key={t} delay={i * 70} className="p-6 rounded-2xl border border-ink-900/8 hover:shadow-card hover:-translate-y-1 transition bg-white">
              <div className="w-10 h-10 rounded-xl bg-bearing-100 text-bearing-600 flex items-center justify-center"><Icon className="w-5 h-5" /></div>
              <p className="font-display font-semibold text-navy-900 mt-4">{t}</p>
              <p className="text-sm text-ink-500 mt-1.5 leading-relaxed">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="how" className="bg-navy-50/60 py-24 border-y border-ink-900/5">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-bearing-600">How it works</p>
            <h2 className="font-display text-3xl font-semibold text-navy-900 mt-2 max-w-lg">From submission to decision, tracked at every bearing.</h2>
          </Reveal>
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            {[
              ["Submit", "Fill in claim details and drag in supporting documents — validated instantly on upload."],
              ["Track", "Watch your claim move through review on a live pipeline with an honest SLA clock."],
              ["Clarify", "If something's unclear, respond right in the thread — no restarting the queue."],
              ["Resolve", "Get a decision with reasons in full, then rate how the process went."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 90}>
                <p className="font-display text-4xl font-semibold text-navy-900/10">{String(i + 1).padStart(2, "0")}</p>
                <p className="font-display font-semibold text-navy-900 mt-1">{t}</p>
                <p className="text-sm text-ink-500 mt-1.5 leading-relaxed">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-bearing-600">Why RightTrack</p>
          <h2 className="font-display text-3xl font-semibold text-navy-900 mt-2 leading-snug">Insurance claims shouldn't feel like shouting into a queue.</h2>
          <p className="text-ink-500 mt-4 leading-relaxed">RightTrack gives policyholders a transparent view of their claim from submission to final decision, and gives operations teams a breach-aware queue that surfaces what's urgent before it becomes a complaint.</p>
          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            {[
              ["Secure & reliable", "Encrypted document storage with role-based access control."],
              ["Complete transparency", "Every stage of a claim is visible — no black-box waiting."],
              ["Real-time updates", "Notified the moment status changes or action is needed."],
              ["Fast, guided process", "A structured 4-step wizard takes minutes, not forms in triplicate."],
            ].map(([t, d]) => (
              <div key={t} className="flex gap-3">
                <span className="w-8 h-8 rounded-lg bg-brass-100 text-brass-600 flex items-center justify-center shrink-0"><Check className="w-4 h-4" /></span>
                <div><p className="font-semibold text-navy-900 text-sm">{t}</p><p className="text-xs text-ink-500 mt-1">{d}</p></div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={120} className="rounded-3xl bg-navy-950 p-8 relative overflow-hidden animate-floaty">
          <CompassDial className="compass-ticks absolute -right-24 -bottom-24 w-80 h-80" />
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <p className="text-white font-display font-semibold">CLM-89210</p>
              <span className="text-xs font-bold text-amber-300 bg-amber-400/10 ring-1 ring-amber-400/30 px-2.5 py-1 rounded-full">Action Required</span>
            </div>
            <div className="space-y-3">
              {["Submitted", "Under Review", "Action Required", "Decision"].map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i < 2 ? "bg-bearing-600 text-white" : i === 2 ? "border-2 border-brass-400 text-brass-400" : "border-2 border-white/15 text-white/30"}`}>
                    {i < 2 ? "✓" : i + 1}
                  </span>
                  <span className={`text-sm ${i <= 2 ? "text-white" : "text-white/30"}`}>{s}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 text-xs text-navy-100/50">Live demo data — enter the app to explore the full workspace.</div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
