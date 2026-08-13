import { useState } from "react";
import { Star } from "lucide-react";
import { Modal } from "../../components/UI.jsx";
import { RATING_TAGS } from "../../lib/constants.js";

export default function RatingModal({ open, onClose, onSubmit }) {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [tags, setTags] = useState([]);
  const [review, setReview] = useState("");
  const toggle = (t) => setTags(tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <p className="font-display font-semibold text-lg text-navy-900">How was your experience?</p>
        <p className="text-sm text-ink-500 mt-1">Your claim has been resolved. A quick rating helps us improve.</p>
        <div className="flex gap-1.5 justify-center my-6">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => setStars(n)} className={`transition ${(hover || stars) >= n ? "text-brass-500" : "text-ink-900/15"}`}>
              <Star className="w-8 h-8" fill={(hover || stars) >= n ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
        <p className="text-xs font-semibold text-ink-700 mb-2">What stood out? (optional)</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {RATING_TAGS.map((t) => (
            <button key={t} onClick={() => toggle(t)} className={`text-xs font-semibold px-3 py-1.5 rounded-full ring-1 transition ${tags.includes(t) ? "bg-navy-900 text-white ring-navy-900" : "bg-white text-ink-700 ring-ink-900/10"}`}>
              {t}
            </button>
          ))}
        </div>
        <textarea value={review} onChange={(e) => setReview(e.target.value)} rows={3} placeholder="Tell us more (optional)" className="input resize-none" />
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="btn-ghost">Skip</button>
          <button disabled={!stars} onClick={() => onSubmit({ stars, tags, review })} className="btn-primary disabled:opacity-40">Submit Rating</button>
        </div>
      </div>
    </Modal>
  );
}
