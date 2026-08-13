import { useState } from "react";
import { Shield, Key, Copy, RotateCw, Trash2, Eye, EyeOff } from "lucide-react";
import { Card, PremiumBadge, PremiumLock } from "../components/UI.jsx";
import { uid } from "../lib/helpers.js";

function CodeBlock({ children, lang = "bash" }) {
  return (
    <div className="rounded-xl bg-navy-950 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <div className="flex gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500/70"></span><span className="w-2.5 h-2.5 rounded-full bg-amber-500/70"></span><span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70"></span></div>
        <span className="text-[10px] font-mono text-navy-100/40 uppercase">{lang}</span>
      </div>
      <pre className="p-4 text-[12.5px] leading-relaxed font-mono text-navy-100/90 overflow-x-auto"><code>{children}</code></pre>
    </div>
  );
}

function IntegrationDiagram() {
  const NODE_W = 168, NODE_H = 48;
  const nodes = [
    { x: 16, y: 40, label: "Mobile App", sub: "iOS / Android SDK" },
    { x: 16, y: 176, label: "Insurer Core System", sub: "Policy & claims DB" },
    { x: 16, y: 312, label: "Admin CRM", sub: "Support & ops tooling" },
    { x: 616, y: 40, label: "Partner Portal", sub: "Broker / agent access" },
    { x: 616, y: 176, label: "Notification Service", sub: "Email · SMS · Push" },
    { x: 616, y: 312, label: "Data Warehouse", sub: "Analytics & reporting" },
  ];
  const cx = 400, cy = 196, cw = 148, ch = 84;
  return (
    <svg viewBox="0 0 800 400" className="w-full h-auto">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#9fb0d6" /></marker>
      </defs>
      {nodes.map((n, i) => {
        const isLeft = n.x < cx;
        const startX = isLeft ? n.x + NODE_W : n.x;
        const endX = isLeft ? cx - cw / 2 : cx + cw / 2;
        return <path key={i} d={`M ${startX} ${n.y + NODE_H / 2} C ${(startX + endX) / 2} ${n.y + NODE_H / 2}, ${(startX + endX) / 2} ${cy}, ${endX} ${cy}`} stroke="#c3cfeb" strokeWidth="1.6" fill="none" markerEnd="url(#arrow)" />;
      })}
      <g>
        <rect x={cx - cw / 2} y={cy - ch / 2} width={cw} height={ch} rx="16" fill="#0b1730" />
        <text x={cx} y={cy - 2} textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="Space Grotesk, sans-serif">RightTrack</text>
        <text x={cx} y={cy + 17} textAnchor="middle" fill="#9fb0d6" fontSize="10" fontFamily="Inter, sans-serif">Claims API + Webhooks</text>
      </g>
      {nodes.map((n, i) => (
        <g key={i}>
          <rect x={n.x} y={n.y} width={NODE_W} height={NODE_H} rx="10" fill="white" stroke="#e2e6f0" strokeWidth="1.4" />
          <text x={n.x + NODE_W / 2} y={n.y + 20} textAnchor="middle" fill="#0d1220" fontSize="12" fontWeight="700" fontFamily="Inter, sans-serif">{n.label}</text>
          <text x={n.x + NODE_W / 2} y={n.y + 35} textAnchor="middle" fill="#8891a5" fontSize="9.5" fontFamily="Inter, sans-serif">{n.sub}</text>
        </g>
      ))}
    </svg>
  );
}

function maskKey(key) {
  return key.slice(0, 8) + "••••••••••••••••" + key.slice(-4);
}

function ApiKeyManager({ pushToast }) {
  const [keys, setKeys] = useState([
    { id: uid("KEY"), label: "Production", key: "rt_live_" + Math.random().toString(36).slice(2, 18) + Math.random().toString(36).slice(2, 18), createdAt: "11 Aug 2026", revealed: false },
  ]);

  const generate = () => {
    const fresh = { id: uid("KEY"), label: `Integration ${keys.length + 1}`, key: "rt_live_" + Math.random().toString(36).slice(2, 18) + Math.random().toString(36).slice(2, 18), createdAt: "13 Aug 2026", revealed: true };
    setKeys((prev) => [fresh, ...prev]);
    pushToast?.({ type: "success", title: "API key generated", body: "Copy it now — you won't see the full key again." });
  };
  const toggleReveal = (id) => setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, revealed: !k.revealed } : k)));
  const copy = (key) => { navigator.clipboard?.writeText(key); pushToast?.({ type: "success", title: "Copied to clipboard" }); };
  const revoke = (id) => { setKeys((prev) => prev.filter((k) => k.id !== id)); pushToast?.({ type: "warn", title: "API key revoked" }); };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-5 py-4 border-b border-ink-900/6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-display font-semibold text-navy-900 flex items-center gap-2">API Keys<PremiumBadge /></p>
          <p className="text-xs text-ink-500 mt-0.5">Scoped Bearer keys for your own integrations. Treat them like passwords.</p>
        </div>
        <button onClick={generate} className="btn-primary px-4 py-2 text-sm inline-flex items-center gap-1.5"><Key className="w-3.5 h-3.5" />Generate New Key</button>
      </div>
      <div className="divide-y divide-ink-900/6">
        {keys.map((k) => (
          <div key={k.id} className="flex items-center gap-4 px-5 py-3.5 flex-wrap">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-navy-900">{k.label}</p>
              <code className="text-xs font-mono text-ink-500">{k.revealed ? k.key : maskKey(k.key)}</code>
            </div>
            <span className="text-xs text-ink-400">Created {k.createdAt}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => toggleReveal(k.id)} className="p-2 rounded-lg hover:bg-navy-50 text-ink-500" title={k.revealed ? "Hide" : "Reveal"}>{k.revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              <button onClick={() => copy(k.key)} className="p-2 rounded-lg hover:bg-navy-50 text-ink-500" title="Copy"><Copy className="w-4 h-4" /></button>
              <button onClick={() => revoke(k.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-600" title="Revoke"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {keys.length === 0 && <p className="px-5 py-6 text-sm text-ink-500 text-center">No API keys yet. Generate one to start integrating.</p>}
      </div>
      <div className="px-5 py-4 bg-navy-50/60 text-xs text-ink-500 flex items-center gap-2"><RotateCw className="w-3.5 h-3.5" />Revoke and regenerate a key any time — old keys stop working immediately.</div>
    </Card>
  );
}

export default function ApiDocs({ role = "applicant", plan = "free", onGoBilling, pushToast }) {
  const [tab, setTab] = useState("rest");
  const isAdjuster = role === "admin";
  const isPremium = plan === "premium";
  const endpoints = [
    ["POST", "/v1/claims", "Create a new claim, returns a reference ID"],
    ["GET", "/v1/claims/:id", "Retrieve full claim status, history & SLA state"],
    ["GET", "/v1/claims", "List claims — filter by status, category, date range"],
    ["POST", "/v1/claims/:id/documents", "Attach a document to an existing claim"],
    ["PATCH", "/v1/claims/:id/status", "Adjuster action: approve, reject, or request info"],
    ["GET", "/v1/claims/:id/audit-log", "Fetch the immutable, timestamped event trail"],
  ];
  const methodColor = { GET: "text-bearing-600 bg-bearing-100", POST: "text-emerald-700 bg-emerald-50", PATCH: "text-amber-700 bg-amber-50" };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy-900">Developer / API</h1>
        <p className="text-ink-500 text-sm mt-1 max-w-2xl">RightTrack exposes a REST API and outbound webhooks so any platform — your mobile app, core insurance system, CRM, or a partner portal — can create, track, and act on claims in real time.</p>
      </div>

      <Card className="p-6">
        <p className="font-display font-semibold text-navy-900 mb-1">How platforms connect</p>
        <p className="text-xs text-ink-500 mb-4">RightTrack sits at the center: any system can push a claim in via the API, and RightTrack pushes status changes back out via webhooks — no polling required.</p>
        <IntegrationDiagram />
      </Card>

      <div className="flex gap-2 flex-wrap">
        {[["rest", "REST Endpoints"], ["webhooks", "Webhooks"], ["sdk", "Quick Start"], ...(isAdjuster ? [["keys", "API Keys"]] : [])].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition inline-flex items-center gap-1.5 ${tab === k ? "bg-navy-900 text-white" : "bg-white text-ink-700 ring-1 ring-ink-900/10"}`}>
            {l}{k === "keys" && !isPremium && <Key className="w-3 h-3 opacity-60" />}
          </button>
        ))}
      </div>

      {tab === "rest" && (
        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-ink-900/6">
            {endpoints.map(([m, path, desc]) => (
              <div key={path} className="flex items-center gap-4 px-5 py-3.5">
                <span className={`text-[11px] font-bold px-2 py-1 rounded-md w-16 text-center ${methodColor[m]}`}>{m}</span>
                <code className="text-sm font-mono text-navy-900 w-64 shrink-0">{path}</code>
                <p className="text-sm text-ink-500">{desc}</p>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 bg-navy-50/60 text-xs text-ink-500 flex items-center gap-2"><Shield className="w-3.5 h-3.5" />All requests require a Bearer API key scoped to your platform integration.</div>
        </Card>
      )}

      {tab === "webhooks" && (
        <Card className="p-6">
          <p className="font-display font-semibold text-navy-900 mb-1">Subscribe to real-time events</p>
          <p className="text-xs text-ink-500 mb-4">Register an HTTPS endpoint in your dashboard; RightTrack signs and POSTs each event as it happens.</p>
          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            {[
              ["claim.status_changed", "Fires whenever a claim moves between pipeline stages"],
              ["claim.sla_breached", "Fires the instant a 48-hour SLA window expires"],
              ["claim.info_requested", "Fires when an adjuster flags a claim for clarification"],
              ["claim.decision_recorded", "Fires on final Approve / Reject decision"],
            ].map(([e, d]) => (
              <div key={e} className="rounded-xl border border-ink-900/8 p-3.5">
                <code className="text-xs font-mono font-semibold text-bearing-600">{e}</code>
                <p className="text-xs text-ink-500 mt-1">{d}</p>
              </div>
            ))}
          </div>
          <CodeBlock lang="json">{`{
  "event": "claim.sla_breached",
  "claim_id": "CLM-89210",
  "status": "action_required",
  "escalated_to": "senior_review",
  "occurred_at": "2026-08-11T09:15:00Z",
  "signature": "sha256=..."
}`}</CodeBlock>
        </Card>
      )}

      {tab === "sdk" && (
        <Card className="p-6 space-y-5">
          <div>
            <p className="font-display font-semibold text-navy-900 mb-2">1. Create a claim from any platform</p>
            <CodeBlock lang="javascript">{`const res = await fetch("https://api.righttrack.app/v1/claims", {
  method: "POST",
  headers: {
    "Authorization": "Bearer " + process.env.RIGHTTRACK_API_KEY,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    applicant: "Daniel Benson",
    policy_id: "LDW/2026/12345",
    category: "Health",
    amount: 250000,
    description: "Emergency room visit following RTA"
  })
});
const claim = await res.json();
// -> { id: "CLM-89532", status: "submitted", sla_deadline: "..." }`}</CodeBlock>
          </div>
          <div>
            <p className="font-display font-semibold text-navy-900 mb-2">2. Poll or subscribe for status</p>
            <CodeBlock lang="javascript">{`// Preferred: register a webhook once, receive pushes forever
app.post("/webhooks/righttrack", (req, res) => {
  const { event, claim_id, status } = req.body;
  syncToPlatform(claim_id, status); // update your CRM / core system
  res.sendStatus(200);
});`}</CodeBlock>
          </div>
          <div>
            <p className="font-display font-semibold text-navy-900 mb-2">3. Mobile / partner portal SDKs</p>
            <p className="text-sm text-ink-500">Thin wrappers around the same REST API are available for iOS, Android and Web, so a policyholder can track a claim natively inside your own app while RightTrack manages the pipeline, SLA clock, and audit trail behind the scenes.</p>
          </div>
        </Card>
      )}

      {tab === "keys" && isAdjuster && (
        isPremium ? (
          <ApiKeyManager pushToast={pushToast} />
        ) : (
          <PremiumLock
            feature="API key generation"
            body="Generate scoped API keys to authenticate your own systems against the RightTrack API. This is a Premium feature for adjuster accounts."
            onUpgrade={onGoBilling}
          />
        )
      )}
    </div>
  );
}
