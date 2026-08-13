import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import Reveal from "../components/Reveal.jsx";

const SECTIONS = [
  { h: "1. Acceptance of terms", b: "By creating an account or submitting a claim through RightTrack, you agree to these terms. If you're using RightTrack on behalf of an insurer or organization, you're confirming you have the authority to accept these terms for them." },
  { h: "2. Accuracy of claims", b: "You're responsible for the accuracy of the information and documents you submit. Submitting false or misleading information in connection with a claim may result in rejection, account suspension, or referral to the relevant authorities." },
  { h: "3. The SLA window", b: "The 48-hour SLA reflects our target response window, not a guaranteed outcome time — complex claims may require additional information, which pauses the countdown until you respond, per the clarification flow." },
  { h: "4. Decisions", b: "Adjuster decisions (approval, rejection, or a request for more information) are made based on policy terms and the documentation provided. A rejection includes a stated reason and code, and you may contact support if you believe a decision was made in error." },
  { h: "5. Account access", b: "Keep your login credentials confidential. You're responsible for activity on your account, and should notify us immediately if you suspect unauthorized access." },
  { h: "6. Changes to the service", b: "We may update or improve RightTrack over time. We'll make reasonable efforts to avoid disrupting claims already in progress when we do." },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <section className="max-w-3xl mx-auto px-6 py-20">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-bearing-600">Legal</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-navy-900 mt-2">Terms &amp; Conditions</h1>
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
