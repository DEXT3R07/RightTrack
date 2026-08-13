import Logo from "./Logo.jsx";
import { useSiteNav } from "../lib/SiteNav.jsx";

export default function SiteFooter() {
  const { onNavAnchor, onHome, onFaq, onBlog, onPrivacy, onTerms } = useSiteNav();
  return (
    <footer className="bg-navy-950 text-navy-100/60">
      <div className="max-w-7xl mx-auto px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Logo variant="light" />
          <p className="text-sm mt-4 leading-relaxed max-w-xs">RightTrack helps policyholders submit claims and track every step, until resolution.</p>
        </div>
        <div>
          <p className="text-white text-sm font-semibold mb-3">Quick Links</p>
          <ul className="space-y-2 text-sm">
            <li><button onClick={onHome} className="hover:text-white transition text-left">Home</button></li>
            <li><button onClick={() => onNavAnchor("about")} className="hover:text-white transition text-left">About</button></li>
            <li><button onClick={() => onNavAnchor("features")} className="hover:text-white transition text-left">Features</button></li>
            <li><button onClick={() => onNavAnchor("how")} className="hover:text-white transition text-left">How it works</button></li>
          </ul>
        </div>
        <div>
          <p className="text-white text-sm font-semibold mb-3">Resources</p>
          <ul className="space-y-2 text-sm">
            <li><button onClick={onFaq} className="hover:text-white transition text-left">FAQ</button></li>
            <li><button onClick={onBlog} className="hover:text-white transition text-left">Blog</button></li>
            <li><button onClick={onPrivacy} className="hover:text-white transition text-left">Privacy Policy</button></li>
            <li><button onClick={onTerms} className="hover:text-white transition text-left">Terms &amp; Conditions</button></li>
          </ul>
        </div>
        <div>
          <p className="text-white text-sm font-semibold mb-3">Get in touch</p>
          <ul className="space-y-2 text-sm">
            <li><a href="mailto:support@righttrack.app" className="hover:text-white transition">support@righttrack.app</a></li>
            <li><a href="tel:+2348000000000" className="hover:text-white transition">+234 800 0000 000</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs">© 2026 RightTrack. All rights reserved.</div>
    </footer>
  );
}
