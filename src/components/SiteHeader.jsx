import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo.jsx";
import { useScrollY } from "../hooks/useReveal.js";
import { useSiteNav } from "../lib/SiteNav.jsx";

export default function SiteHeader() {
  const { onNavAnchor, onDevelopers, onGetStarted, onLogin, onHome } = useSiteNav();
  const scrollY = useScrollY();
  const shrink = scrollY > 24;
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (fn) => { fn(); setMobileOpen(false); };

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
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={onLogin} className="hidden sm:block text-sm font-semibold text-navy-900 hover:text-bearing-600">Log in</button>
          <button onClick={onGetStarted} className="text-sm font-semibold bg-navy-900 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-navy-800 transition shadow-card">Get Started</button>
          <button onClick={() => setMobileOpen((o) => !o)} className="md:hidden p-2 -mr-2 text-ink-700" aria-label="Menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-ink-900/8 shadow-card">
          <nav className="max-w-7xl mx-auto px-6 py-3 flex flex-col text-sm font-medium text-ink-700">
            <button onClick={() => go(() => onNavAnchor("features"))} className="text-left py-2.5 border-b border-ink-900/6 hover:text-navy-900">Features</button>
            <button onClick={() => go(() => onNavAnchor("how"))} className="text-left py-2.5 border-b border-ink-900/6 hover:text-navy-900">How it works</button>
            <button onClick={() => go(onDevelopers)} className="text-left py-2.5 border-b border-ink-900/6 hover:text-navy-900">Developers</button>
            <button onClick={() => go(() => onNavAnchor("about"))} className="text-left py-2.5 border-b border-ink-900/6 hover:text-navy-900">About</button>
            <button onClick={() => go(onLogin)} className="text-left py-2.5 hover:text-navy-900">Log in</button>
          </nav>
        </div>
      )}
    </header>
  );
}
