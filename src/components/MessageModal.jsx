import { useState } from "react";
import { Send, Mail } from "lucide-react";
import { Modal, Field } from "./UI.jsx";

export default function MessageModal({ open, onClose, person, onSend }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const reset = () => { setSubject(""); setBody(""); };
  const close = () => { reset(); onClose(); };

  const handleSend = (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    onSend({ subject, body });
    close();
  };

  if (!person) return null;

  return (
    <Modal open={open} onClose={close}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-navy-100 text-navy-700 flex items-center justify-center shrink-0"><Mail className="w-4.5 h-4.5" /></div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-navy-900 truncate">Message {person.name}</p>
            <p className="text-xs text-ink-500 truncate">{person.email}</p>
          </div>
        </div>
        <form className="space-y-4 mt-5" onSubmit={handleSend}>
          <Field label="Subject">
            <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Update on your recent claim" required />
          </Field>
          <Field label="Message">
            <textarea className="input min-h-[120px] resize-none" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your message..." required />
          </Field>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={close} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1"><Send className="w-3.5 h-3.5" />Send</button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
