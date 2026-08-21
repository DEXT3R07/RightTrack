import { useState } from "react";
import { Menu, X, Sparkles, Workflow, Code2, Users, LogIn } from "lucide-react";
import Logo from "./Logo.jsx";
import { useScrollY } from "../hooks/useReveal.js";
import { useSiteNav } from "../lib/SiteNav.jsx";

export default function SiteHeader() {
  const { onNavAnchor, onDevelopers, onGetStarted, onLogin, onHome } = useSiteNav();
  const scrollY = useScrollY();
  const shrink = scrollY > 24;
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (fn) => { fn(); setMobileOpen(false); };

  const mobileLinks = [
    ["Features", Sparkles, () => onNavAnchor("features")],
    ["How it works", Workflow, () => onNavAnchor("how")],
    ["Developers", Code2, onDevelopers],
    ["About", Users, () => onNavAnchor("about")],
  ];

  return (
    <header className={`sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-ink-900/5 transition-all duration-300 ${shrink ? "h-14" : "h-16"}`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between relative">
        <button onClick={onHome} className="shrink-0">
          <Logo size={shrink ? "sm" : "md"} />
        </button>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-700">
          <button onClick={() => onNavAnchor("features")} className="hover:text-navy-900 transition-colors">Features</button>
          <button onClick={() => onNavAnchor("how")} className="hover:text-navy-900 transition-colors">How it works</button>
          <button onClick={onDevelopers} className="hover:text-navy-900 transition-colors">Developers</button>
          <button onClick={() => onNavAnchor("about")} className="hover:text-navy-900 transition-colors">About</button>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={onLogin} className="hidden sm:block text-sm font-semibold text-navy-900 hover:text-bearing-600 transition-colors">Log in</button>
          <button onClick={onGetStarted} className="text-sm font-semibold bg-navy-900 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-navy-800 transition shadow-card">Get Started</button>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className={`md:hidden relative w-10 h-10 shrink-0 flex items-center justify-center rounded-xl transition-colors ${mobileOpen ? "bg-navy-900 text-white" : "bg-navy-50 text-navy-900 hover:bg-navy-100"}`}
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            <span className="relative w-5 h-5 block">
              <Menu className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${mobileOpen ? "opacity-0 rotate-45 scale-75" : "opacity-100 rotate-0 scale-100"}`} />
              <X className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${mobileOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-45 scale-75"}`} />
            </span>
          </button>
        </div>

        <div
          className={`md:hidden absolute top-full left-0 right-0 origin-top transition-all duration-200 ${
            mobileOpen ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"
          }`}
        >
          <nav className="mx-4 mt-2 rounded-2xl bg-white shadow-pop ring-1 ring-ink-900/8 overflow-hidden">
            {mobileLinks.map(([label, Icon, fn]) => (
              <button
                key={label}
                onClick={() => go(fn)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-ink-700 border-b border-ink-900/6 hover:bg-navy-50/70 hover:text-navy-900 transition-colors"
              >
                <span className="w-8 h-8 rounded-lg bg-bearing-100/70 text-bearing-600 flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></span>
                {label}
              </button>
            ))}
            <button
              onClick={() => go(onLogin)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-navy-900 hover:bg-navy-50/70 transition-colors"
            >
              <span className="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center shrink-0"><LogIn className="w-4 h-4" /></span>
              Log in
            </button>
          </nav>
        </div>
      </div>
      {mobileOpen && <div className="md:hidden fixed inset-0 top-14 bg-navy-950/20 -z-10" onClick={() => setMobileOpen(false)}></div>}
    </header>
  );
}
