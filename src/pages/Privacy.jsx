import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import Reveal from "../components/Reveal.jsx";

const SECTIONS = [
  { h: "1. What we collect", b: "When you submit a claim, we collect the information you provide directly — your name, policy number, claim category, amount, description, and any supporting documents you upload. We also record account details like your email address." },
  { h: "2. How we use it", b: "Your information is used to process and adjudicate your claim, communicate status updates, and maintain the audit trail required for compliance. We don't sell claim data or use it for advertising." },
  { h: "3. Who can see it", b: "Claim details are visible to you and to the adjuster assigned to your claim. Access is role-based — an adjuster can only see claims routed to their queue, not your full account history." },
  { h: "4. Document storage", b: "Uploaded documents are encrypted at rest and in transit. Files are retained for as long as your claim record is required to be kept for regulatory purposes, then deleted." },
  { h: "5. Your rights", b: "You can request a copy of the data we hold on a claim, ask us to correct inaccurate information, or ask about deletion once a claim is closed and outside any mandatory retention period, by contacting support@righttrack.app." },
  { h: "6. Changes to this policy", b: "If this policy changes in a way that affects how your data is handled, we'll post the update here and, where required, notify you directly." },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <section className="max-w-3xl mx-auto px-6 py-20">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-bearing-600">Legal</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-navy-900 mt-2">Privacy Policy</h1>
          <p className="text-sm text-ink-500 mt-3">Last updated August 1, 2026</p>
        </Reveal>
        <div className="mt-10 space-y-8">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.h} delay={i * 50}>
              <h2 className="font-display font-semibold text-navy-900 text-lg">{s.h}</h2>
              <p className="text-sm text-ink-600 mt-2 leading-relaxed">{s.b}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
