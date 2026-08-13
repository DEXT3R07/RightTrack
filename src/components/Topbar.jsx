import { Menu, Bell, User, Sparkles, ShieldAlert } from "lucide-react";

export default function Topbar({ title, subtitle, role, plan, onMenu, notifCount, onBell }) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/85 backdrop-blur border-b border-ink-900/6 flex items-center justify-between px-4 sm:px-8 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onMenu} className="lg:hidden p-2 -ml-2 text-ink-700"><Menu className="w-5 h-5" /></button>
        <div className="min-w-0">
          <p className="font-display font-semibold text-navy-900 truncate">{title}</p>
          {subtitle && <p className="text-xs text-ink-500 truncate">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <button onClick={onBell} className="relative p-2 rounded-lg hover:bg-navy-50 text-ink-700">
          <Bell className="w-5 h-5" />
          {notifCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
              {notifCount}
            </span>
          )}
        </button>
        {role === "admin" && (
          <span className={`hidden md:inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 rounded-full ${plan === "premium" ? "bg-navy-900 text-white" : "bg-navy-50 text-navy-700 ring-1 ring-navy-900/10"}`}>
            {plan === "premium" && <Sparkles className="w-3 h-3" />}{plan === "premium" ? "Premium" : "Standard"}
          </span>
        )}
        {role === "superadmin" && (
          <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-navy-900 text-white">
            <ShieldAlert className="w-3 h-3" />Super Admin
          </span>
        )}
        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-ink-900/8">
          <div className="w-8 h-8 rounded-full bg-navy-100 text-navy-700 flex items-center justify-center"><User className="w-4 h-4" /></div>
          <div className="leading-tight">
            <p className="text-xs font-semibold text-navy-900">{role === "admin" ? "Adjuster Console" : role === "superadmin" ? "Super Admin Console" : "Policy Holder"}</p>
            <p className="text-[11px] text-ink-500">{role === "admin" ? "B. Umar · Claims Unit 2" : role === "superadmin" ? "System Administrator" : "policyholder@mail.com"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
