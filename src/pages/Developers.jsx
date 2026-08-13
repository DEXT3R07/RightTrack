import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import Reveal from "../components/Reveal.jsx";
import CompassDial from "../components/CompassDial.jsx";
import ApiDocs from "./ApiDocs.jsx";
import { useSiteNav } from "../lib/SiteNav.jsx";

export default function Developers() {
  const { onGetStarted } = useSiteNav();
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <section className="relative overflow-hidden bg-navy-950">
        <CompassDial className="compass-ticks absolute -right-40 -top-40 w-[560px] h-[560px]" />
        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <Reveal className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brass-400 bg-white/5 ring-1 ring-white/10 px-3.5 py-1.5 rounded-full mb-6">
            Built for integration
          </Reveal>
          <Reveal as="h1" delay={80} className="font-display text-4xl sm:text-5xl font-semibold text-white leading-[1.1] tracking-tight">
            Bring RightTrack into your own stack.
          </Reveal>
          <Reveal delay={160} className="text-navy-100/70 text-lg mt-5 max-w-xl mx-auto leading-relaxed">
            A REST API and outbound webhooks so your mobile app, core insurance system, CRM, or partner portal can create, track, and act on claims in real time.
          </Reveal>
          <Reveal delay={240} className="mt-8">
            <button onClick={onGetStarted} className="bg-bearing-600 hover:bg-bearing-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-pop transition hover:-translate-y-0.5">Get an API key</button>
          </Reveal>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <Reveal><ApiDocs /></Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
