import Logo from "./Logo.jsx";
import { useScrollY } from "../hooks/useReveal.js";
import { useSiteNav } from "../lib/SiteNav.jsx";

export default function SiteHeader() {
  const { onNavAnchor, onDevelopers, onGetStarted, onLogin, onHome } = useSiteNav();
  const scrollY = useScrollY();
  const shrink = scrollY > 24;

  return (
    <header className={`sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-ink-900/5 transition-all duration-300 ${shrink ? "h-14" : "h-16"}`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <button onClick={onHome} className="shrink-0">
          <Logo size={shrink ? "sm" : "md"} />
        </button>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-700">
          <button onClick={() => onNavAnchor("features")} className="hover:text-navy-900">Features</button>
          <button onClick={() => onNavAnchor("how")} className="hover:text-navy-900">How it works</button>
          <button onClick={onDevelopers} className="hover:text-navy-900">Developers</button>
          <button onClick={() => onNavAnchor("about")} className="hover:text-navy-900">About</button>
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={onLogin} className="hidden sm:block text-sm font-semibold text-navy-900 hover:text-bearing-600">Log in</button>
          <button onClick={onGetStarted} className="text-sm font-semibold bg-navy-900 text-white px-4 py-2.5 rounded-lg hover:bg-navy-800 transition shadow-card">Get Started</button>
        </div>
      </div>
    </header>
  );
}
