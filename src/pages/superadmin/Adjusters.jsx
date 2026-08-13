import { useState } from "react";
import { Search, Mail, Phone, MessageSquare, Ban, CheckCircle2, Star, Plus } from "lucide-react";
import { Card, Modal, Field } from "../../components/UI.jsx";
import MessageModal from "../../components/MessageModal.jsx";
import { ADJUSTER_STATUS_META } from "../../lib/constants.js";
import { slaInfo, fmtDate } from "../../lib/helpers.js";

export default function SuperAdminAdjusters({ adjusters, claims, onToggleStatus, onAddAdjuster, pushToast }) {
  const [q, setQ] = useState("");
  const [messaging, setMessaging] = useState(null);
  const [inviting, setInviting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", unit: "Claims Unit 1" });

  const rows = adjusters.filter((a) => a.name.toLowerCase().includes(q.toLowerCase()) || a.email.toLowerCase().includes(q.toLowerCase()));

  const statsFor = (a) => {
    const owned = claims.filter((c) => c.adjuster === a.name);
    const attended = owned.filter((c) => c.status === "approved" || c.status === "rejected");
    const breached = owned.filter((c) => slaInfo(c).breached);
    const rated = owned.filter((c) => c.rating && c.rating.stars);
    const rating = rated.length ? rated.reduce((s, c) => s + c.rating.stars, 0) / rated.length : null;
    return { assigned: owned.length, attended: attended.length, breached: breached.length, rating };
  };

  const canInvite = form.name.trim().length > 1 && form.email.includes("@");
  const submitInvite = (e) => {
    e.preventDefault();
    if (!canInvite) return;
    onAddAdjuster(form);
    pushToast({ type: "success", title: "Adjuster invited", body: `${form.name} has been added to the roster.` });
    setForm({ name: "", email: "", phone: "", unit: "Claims Unit 1" });
    setInviting(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900">Adjusters</h1>
          <p className="text-ink-500 text-sm mt-1">Team roster, performance, and access control.</p>
        </div>
        <button onClick={() => setInviting(true)} className="btn-primary text-sm"><Plus className="w-4 h-4" />Invite Adjuster</button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email..." className="input pl-9 max-w-md" />
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {rows.map((a) => {
          const s = statsFor(a);
          const meta = ADJUSTER_STATUS_META[a.status];
          return (
            <Card key={a.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-navy-100 text-navy-700 flex items-center justify-center text-sm font-bold shrink-0">{a.name.split(" ").map((s) => s[0]).join("")}</div>
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-navy-900 truncate">{a.name}</p>
                    <p className="text-xs text-ink-500 truncate">{a.unit}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset shrink-0 ${meta.cls}`}>{meta.label}</span>
              </div>
              <div className="mt-3 space-y-1.5 text-xs text-ink-500">
                <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{a.email}</p>
                <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{a.phone}</p>
                <p>On team since {fmtDate(a.joinedAt)}</p>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-ink-900/6 text-center">
                <div><p className="font-display font-semibold text-navy-900 num">{s.assigned}</p><p className="text-[10px] text-ink-500 uppercase">Assigned</p></div>
                <div><p className="font-display font-semibold text-navy-900 num">{s.attended}</p><p className="text-[10px] text-ink-500 uppercase">Attended</p></div>
                <div><p className={`font-display font-semibold num ${s.breached ? "text-red-600" : "text-navy-900"}`}>{s.breached}</p><p className="text-[10px] text-ink-500 uppercase">Breached</p></div>
                <div><p className="font-display font-semibold text-navy-900 num flex items-center justify-center gap-0.5">{s.rating ? s.rating.toFixed(1) : "—"}{s.rating && <Star className="w-3 h-3 text-brass-500" fill="currentColor" />}</p><p className="text-[10px] text-ink-500 uppercase">Rating</p></div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setMessaging(a)} className="btn-ghost flex-1 text-xs py-2"><MessageSquare className="w-3.5 h-3.5" />Message</button>
                <button
                  onClick={() => onToggleStatus(a.id)}
                  className={`flex-1 text-xs py-2 rounded-xl font-semibold inline-flex items-center justify-center gap-1.5 transition ${
                    a.status === "active" ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {a.status === "active" ? <><Ban className="w-3.5 h-3.5" />Suspend</> : <><CheckCircle2 className="w-3.5 h-3.5" />Reactivate</>}
                </button>
              </div>
            </Card>
          );
        })}
        {rows.length === 0 && <p className="text-sm text-ink-500 col-span-2 text-center py-10">No adjusters match your search.</p>}
      </div>

      <MessageModal
        open={!!messaging}
        person={messaging}
        onClose={() => setMessaging(null)}
        onSend={({ subject }) => pushToast({ type: "success", title: `Message sent to ${messaging.name}`, body: subject })}
      />

      <Modal open={inviting} onClose={() => setInviting(false)}>
        <div className="p-6">
          <p className="font-display font-semibold text-navy-900 text-lg">Invite Adjuster</p>
          <p className="text-xs text-ink-500 mt-1">They'll get an email to set up their claims console access.</p>
          <form className="space-y-4 mt-5" onSubmit={submitInvite}>
            <Field label="Full Name"><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. K. Nnamdi" required /></Field>
            <Field label="Email"><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@righttrack.africa" required /></Field>
            <Field label="Phone"><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+234 ..." /></Field>
            <Field label="Unit">
              <select className="input" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                <option>Claims Unit 1</option><option>Claims Unit 2</option><option>Claims Unit 3</option>
              </select>
            </Field>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setInviting(false)} className="btn-ghost flex-1">Cancel</button>
              <button type="submit" disabled={!canInvite} className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed">Send Invite</button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
