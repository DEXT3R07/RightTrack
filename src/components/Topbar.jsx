import { Menu, Bell, User, Sparkles, ShieldAlert } from "lucide-react";

export default function Topbar({ title, subtitle, role, plan, onMenu, notifCount, onBell, onSettings, avatarUrl, profile }) {
  const planLabel = plan === "premium" ? "Subscribed" : plan === "trial" ? "Free Trial" : "Free Plan";
  const accent = role === "superadmin" ? "from-brass-500 to-brass-600" : role === "admin" ? "from-bearing-600 to-bearing-400" : "from-navy-700 to-bearing-500";
  const roleLabel = role === "admin" ? "Adjuster Console" : role === "superadmin" ? "Super Admin Console" : "Policy Holder";
  const identityLine = role === "admin"
    ? profile?.orgName || "Adjuster account"
    : profile?.fullName || profile?.email || (role === "superadmin" ? "System Administrator" : "Policyholder account");
  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-ink-900/6 shrink-0">
      <div className={`h-[3px] bg-gradient-to-r ${accent}`}></div>
      <div className="h-[61px] flex items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onMenu} className="lg:hidden p-2.5 -ml-1 rounded-xl bg-navy-50 text-navy-900 hover:bg-navy-100 transition-colors shrink-0"><Menu className="w-5 h-5" /></button>
          <div className="min-w-0">
            <p className="font-display font-semibold text-navy-900 truncate">{title}</p>
            {subtitle && <p className="text-xs text-ink-500 truncate">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button onClick={onBell} className="relative p-2 rounded-lg hover:bg-bearing-100/70 text-ink-700 hover:text-bearing-600 transition-colors">
            <Bell className="w-5 h-5" />
            {notifCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulsew">
                {notifCount}
              </span>
            )}
          </button>
          {role === "admin" && (
            <span className={`hidden md:inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 rounded-full ${plan !== "free" ? "bg-gradient-to-r from-navy-900 to-bearing-600 text-white" : "bg-navy-50 text-navy-700 ring-1 ring-navy-900/10"}`}>
              {plan !== "free" && <Sparkles className="w-3 h-3" />}{planLabel}
            </span>
          )}
          {role === "superadmin" && (
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-gradient-to-r from-brass-600 to-brass-500 text-white">
              <ShieldAlert className="w-3 h-3" />Super Admin
            </span>
          )}
          <button onClick={onSettings} className="flex items-center gap-2 sm:pl-3 sm:border-l border-ink-900/8 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bearing-500 to-navy-800 text-white flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm shrink-0">
              {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : <User className="w-4 h-4" />}
            </div>
            <div className="hidden sm:block leading-tight text-left">
              <p className="text-xs font-semibold text-navy-900">{roleLabel}</p>
              <p className="text-[11px] text-ink-500 truncate max-w-[140px]">{identityLine}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
