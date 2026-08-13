import { useState } from "react";
import { Calendar, ArrowRight, X } from "lucide-react";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import Reveal from "../components/Reveal.jsx";
import { Card, Modal } from "../components/UI.jsx";

const POSTS = [
  {
    title: "Why we built claims tracking around a 48-hour clock",
    date: "Aug 3, 2026",
    tag: "Product",
    excerpt: "Most claims platforms hide their SLA. We put ours on the tracker itself — here's why that changes how fast claims actually move.",
    body: [
      "Most claims platforms treat their internal SLA as a private operations metric — something tracked on a dashboard somewhere, invisible to the person actually waiting on a decision. We took the opposite position: the 48-hour window is printed right on the applicant's own tracker, counting down in real time.",
      "That single decision changes behavior on both sides. For an applicant, the countdown replaces the anxious \"has anyone even looked at this?\" with a concrete number. For an adjuster, a shared, visible clock is a much stronger forcing function than an internal reminder that only the ops team sees.",
      "It also forces discipline into the product itself. If we're going to show a countdown, it has to be honest — so every state change, from document validation to a status flip, is timestamped in the same audit trail the applicant's clock is built from. There's no separate, friendlier number quietly running behind the scenes.",
      "The result, six months in, is fewer support tickets asking for status updates and a queue that self-prioritizes: claims closest to breach visually stand out to adjusters before a customer ever has to escalate.",
    ],
  },
  {
    title: "Inside the escalation path: what happens when a claim breaches SLA",
    date: "Jul 22, 2026",
    tag: "Product",
    excerpt: "A breached claim doesn't just sit there. It jumps the queue, gets flagged, and lands on a senior adjuster's desk automatically.",
    body: [
      "Breaching the 48-hour window doesn't put a claim in limbo — it triggers a defined escalation path. The moment the clock hits zero on an unresolved claim, three things happen in the same instant: the claim is re-flagged as breached in the priority queue, it's moved to the top regardless of when it was submitted, and it's routed to senior review.",
      "The applicant sees this too. Rather than a claim that silently goes quiet, they get a status banner explaining exactly what happened — SLA exceeded, automatically escalated — and an acknowledgment that the delay is on us, not something they need to chase.",
      "We deliberately made this automatic rather than something an adjuster has to remember to trigger. Manual escalation is the kind of process step that gets skipped under load, which is exactly when it matters most — when queues are backed up and something is genuinely at risk of being forgotten.",
      "On the operations side, this feeds directly into the SLA Monitor on the adjuster dashboard, so a team lead can see breach volume trending in real time rather than reconstructing it from a weekly report.",
    ],
  },
  {
    title: "Designing a clarification loop that doesn't cost you your place in line",
    date: "Jul 9, 2026",
    tag: "Design",
    excerpt: "Most systems make you resubmit from scratch when something's unclear. We rebuilt that flow around a single, focused re-upload.",
    body: [
      "A surprising amount of claims friction has nothing to do with the claim itself — it's the process of fixing a small problem with it. A blurry invoice. A missing signature page. In most systems we looked at, resolving that meant starting the submission over, landing back at the end of the queue.",
      "We rebuilt this as a targeted loop instead. When an adjuster flags a claim, the applicant sees exactly what's wrong — not a generic \"more information needed,\" but the specific reason, in the adjuster's own words — and a single re-upload control scoped to that one issue.",
      "Submitting the fix doesn't restart the claim's timeline. It returns to the adjuster's queue at the same position it held before being flagged, and the whole exchange — the original flag, the applicant's response, the timestamp of each — is preserved in the audit log.",
      "The design goal was narrow: never make an applicant feel punished for something being unclear. A five-minute fix should cost five minutes, not a trip to the back of the line.",
    ],
  },
  {
    title: "Connecting RightTrack to your core insurance system",
    date: "Jun 28, 2026",
    tag: "Engineering",
    excerpt: "A look at the webhook-first architecture behind our API, and why polling was never the right model for claims status.",
    body: [
      "When we scoped the API, the first architectural decision was whether status updates should be pulled or pushed. Polling is the easier integration to write on day one, but it scales badly — every consumer ends up guessing at a poll interval that's either too slow to feel real-time or too aggressive for no reason.",
      "We went webhook-first instead. Register an HTTPS endpoint once, and RightTrack pushes signed events — claim.status_changed, claim.sla_breached, claim.decision_recorded — the instant they happen. A core insurance system, a CRM, and a partner portal can all subscribe to the same event stream independently.",
      "The REST API is still there for the actions that genuinely need a request/response — creating a claim, attaching a document, pulling the full audit log for a compliance export — but day-to-day status sync doesn't need it.",
      "In practice, this means a claim submitted through a partner's mobile app can update that partner's own backend, trigger a notification service, and land in a data warehouse for reporting, all from one event, with no system needing to ask RightTrack \"has anything changed yet?\"",
    ],
  },
];

function PostModal({ post, onClose }) {
  return (
    <Modal open={!!post} onClose={onClose} wide>
      {post && (
        <div className="p-7 sm:p-9">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wide text-bearing-600">{post.tag}</span>
              <h2 className="font-display text-2xl font-semibold text-navy-900 mt-2 leading-snug">{post.title}</h2>
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-500 mt-2"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
            </div>
            <button onClick={onClose} className="p-2 -mt-1 -mr-1 rounded-lg hover:bg-navy-50 text-ink-400 shrink-0"><X className="w-5 h-5" /></button>
          </div>
          <div className="mt-6 space-y-4">
            {post.body.map((para, i) => (
              <p key={i} className="text-sm text-ink-600 leading-relaxed">{para}</p>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}

export default function Blog() {
  const [openPost, setOpenPost] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <section className="max-w-5xl mx-auto px-6 py-20">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-bearing-600 text-center">Blog</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-navy-900 mt-2 text-center">Notes on claims, SLAs, and process</h1>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-5 mt-12">
          {POSTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 70}>
              <Card
                onClick={() => setOpenPost(p)}
                className="p-6 h-full flex flex-col hover:shadow-pop hover:-translate-y-1 transition cursor-pointer"
              >
                <span className="text-[11px] font-bold uppercase tracking-wide text-bearing-600">{p.tag}</span>
                <p className="font-display font-semibold text-navy-900 mt-2 leading-snug">{p.title}</p>
                <p className="text-sm text-ink-500 mt-2 leading-relaxed flex-1">{p.excerpt}</p>
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-ink-900/6">
                  <span className="inline-flex items-center gap-1.5 text-xs text-ink-500"><Calendar className="w-3.5 h-3.5" />{p.date}</span>
                  <span
                    onClick={(e) => { e.stopPropagation(); setOpenPost(p); }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-bearing-600"
                  >
                    Read <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
      <SiteFooter />
      <PostModal post={openPost} onClose={() => setOpenPost(null)} />
    </div>
  );
}
