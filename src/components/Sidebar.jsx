import { LayoutDashboard, Plus, Folder, Code2, Layers, LogOut, Sparkles, CreditCard, ShieldAlert, Users, UserRound } from "lucide-react";
import Logo from "./Logo.jsx";

export default function Sidebar({ role, plan, active, onNav, onRoleSwitch, onExit, mobileOpen, setMobileOpen }) {
  const applicantNav = [
    ["dashboard", "Dashboard", LayoutDashboard],
    ["new", "New Claim", Plus],
    ["claims", "My Claims", Folder],
    ["api", "Developer / API", Code2],
  ];
  const isPremium = plan === "premium";
  const adminNav = [
    ["dashboard", "Dashboard", LayoutDashboard],
    ["queue", "Claims Queue", Folder],
    ["api", "Developer / API", Code2],
    ["billing", isPremium ? "Plans & Billing" : "Upgrade to Premium", isPremium ? CreditCard : Sparkles],
  ];
  const superAdminNav = [
    ["sa-dashboard", "Overview", LayoutDashboard],
    ["sa-claims", "All Claims", Folder],
    ["sa-adjusters", "Adjusters", ShieldAlert],
    ["sa-policyholders", "Policyholders", UserRound],
  ];
  const items = role === "admin" ? adminNav : role === "superadmin" ? superAdminNav : applicantNav;

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-navy-950/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)}></div>}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-64 bg-navy-950 text-white flex flex-col z-50 transition-transform duration-300 shrink-0
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
          <Logo variant="light" />
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto scrollbar-none">
          {items.map(([key, label, Icon]) => {
            const isUpgradeCta = key === "billing" && !isPremium;
            return (
              <button
                key={key}
                onClick={() => { onNav(key); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition
                  ${active === key ? "bg-white/10 text-white" : isUpgradeCta ? "text-brass-400 hover:bg-white/5 hover:text-brass-400" : "text-navy-100/60 hover:bg-white/5 hover:text-white"}`}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} /> {label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          {role !== "superadmin" && (
            <button onClick={onRoleSwitch} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-navy-100/60 hover:bg-white/5 hover:text-white transition">
              <Layers className="w-[18px] h-[18px]" strokeWidth={1.8} /> Switch to {role === "admin" ? "Applicant" : "Adjuster"} view
            </button>
          )}
          <button onClick={onExit} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-navy-100/60 hover:bg-white/5 hover:text-white transition">
            <LogOut className="w-[18px] h-[18px]" strokeWidth={1.8} /> Log out
          </button>
        </div>
      </aside>
    </>
  );
}
