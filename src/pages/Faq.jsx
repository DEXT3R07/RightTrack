import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import Reveal from "../components/Reveal.jsx";
import { Card } from "../components/UI.jsx";

const FAQS = [
  { q: "How long does a claim take to resolve?", a: "Every claim carries a 48-hour SLA clock from the moment it's submitted. Most claims resolve well inside that window — if one runs over, it's automatically escalated to senior review, and you'll see that reflected live on your claim's tracker." },
  { q: "What documents do I need to submit a claim?", a: "It depends on the claim category, but generally you'll want any receipts, invoices, medical or repair reports, and your policy or ID documents. The upload step accepts PDF, PNG, and JPEG files up to 10MB each." },
  { q: "What happens if my claim is flagged for more information?", a: "You'll see an \"Action Required\" status with a note explaining exactly what's missing or unclear. You can re-upload the specific document without losing your place in the review queue — no need to resubmit the whole claim." },
  { q: "Can I track a claim after it's been rejected?", a: "Yes — a rejected claim stays visible in My Claims with the rejection code and the adjuster's notes, so you always have a full record of why the decision was made." },
  { q: "Is my data secure?", a: "Documents and personal information are stored with encryption and role-based access, so only your assigned adjuster can view claim details tied to your policy." },
  { q: "Can other systems connect to RightTrack?", a: "Yes — see the Developers page for the REST API and webhook reference. Any platform, from a mobile app to your insurer's core system, can create and track claims programmatically." },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="p-0 overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="font-semibold text-navy-900 text-sm">{q}</span>
        <ChevronDown className={`w-4 h-4 text-ink-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm text-ink-500 leading-relaxed">{a}</p>
        </div>
      </div>
    </Card>
  );
}

export default function Faq() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <section className="max-w-3xl mx-auto px-6 py-20">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-bearing-600 text-center">FAQ</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-navy-900 mt-2 text-center">Frequently asked questions</h1>
        </Reveal>
        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <FaqItem {...f} />
            </Reveal>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
