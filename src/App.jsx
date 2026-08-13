import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import NotifPanel from "./components/NotifPanel.jsx";
import { Toast } from "./components/UI.jsx";
import Landing from "./pages/Landing.jsx";
import Developers from "./pages/Developers.jsx";
import Faq from "./pages/Faq.jsx";
import Blog from "./pages/Blog.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import { SignUp, Login, VerifyEmail, SuperAdminLogin } from "./pages/Auth.jsx";
import ApplicantDashboard from "./pages/applicant/Dashboard.jsx";
import NewClaimWizard from "./pages/applicant/NewClaim.jsx";
import MyClaims from "./pages/applicant/MyClaims.jsx";
import ClaimDetailApplicant from "./pages/applicant/ClaimDetail.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import ClaimsQueue from "./pages/admin/Queue.jsx";
import ClaimReview from "./pages/admin/ClaimReview.jsx";
import Billing from "./pages/admin/Billing.jsx";
import SuperAdminDashboard from "./pages/superadmin/Dashboard.jsx";
import SuperAdminClaims from "./pages/superadmin/Claims.jsx";
import SuperAdminAdjusters from "./pages/superadmin/Adjusters.jsx";
import SuperAdminPolicyholders from "./pages/superadmin/Policyholders.jsx";
import ApiDocs from "./pages/ApiDocs.jsx";
import { seedClaims, seedAdjusters, seedPolicyholders } from "./lib/data.js";
import { NOW, fmtMoney, uid } from "./lib/helpers.js";
import { PREMIUM_PRICE } from "./lib/constants.js";
import { SiteNavContext } from "./lib/SiteNav.jsx";

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [scrollTarget, setScrollTarget] = useState(null);
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingRole, setPendingRole] = useState("applicant");
  const [role, setRole] = useState("applicant");
  const [plan, setPlan] = useState("free");
  const [claims, setClaims] = useState(seedClaims);
  const [adjusters, setAdjusters] = useState(seedAdjusters);
  const [policyholders, setPolicyholders] = useState(seedPolicyholders);
  const [view, setView] = useState("dashboard");
  const [selected, setSelected] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    if (screen === "landing" && scrollTarget) return;
    window.scrollTo(0, 0);
  }, [screen]); // eslint-disable-line react-hooks/exhaustive-deps

  const pushToast = (t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4200);
  };

  const enterApp = (r = "applicant") => { setRole(r); setScreen("app"); setView(r === "superadmin" ? "sa-dashboard" : "dashboard"); };
  const exitApp = () => { setScreen("landing"); setView("dashboard"); setSelected(null); };
  const switchRole = () => { setRole((r) => (r === "admin" ? "applicant" : "admin")); setView("dashboard"); setSelected(null); };
  const openClaim = (id) => { setSelected(id); setView("detail"); };

  const addClaim = (claimObj, refToOpen) => {
    if (claimObj) { setClaims((prev) => [claimObj, ...prev]); pushToast({ type: "success", title: "Claim submitted", body: `Reference ${claimObj.id} created.` }); }
    if (refToOpen) { setSelected(refToOpen); setView("detail"); }
  };

  const reupload = (id, files) => {
    setClaims((prev) => prev.map((c) => c.id === id ? {
      ...c, status: "under_review", documents: [...c.documents, ...files],
      history: [...c.history,
        { ts: NOW.toISOString().replace("Z", ".231000"), label: "Applicant re-uploaded document", detail: `${files.length} new file(s) submitted in response to flag` },
        { ts: NOW.toISOString().replace("Z", ".402000"), label: "Status changed to Under Review", detail: "Returned to adjuster queue at same position" },
      ],
    } : c));
    pushToast({ type: "success", title: "Document submitted", body: "Your claim is back under review." });
  };

  const rate = (id, r) => {
    setClaims((prev) => prev.map((c) => (c.id === id ? { ...c, rating: r } : c)));
    pushToast({ type: "success", title: "Thanks for your feedback!" });
  };

  const decide = (id, status, { rejectionCode, notes } = {}) => {
    setClaims((prev) => prev.map((c) => c.id === id ? {
      ...c, status, rejectionCode, rejectionNotes: notes,
      history: [...c.history, { ts: NOW.toISOString().replace("Z", ".550000"), label: `Decision recorded: ${status === "approved" ? "Approved" : "Rejected"}`, detail: notes || (status === "approved" ? "Approved in full" : "See rejection code") }],
    } : c));
    pushToast({ type: status === "approved" ? "success" : "warn", title: `${id} marked ${status}`, body: "Applicant view updated in real time." });
  };

  const upgradePlan = (cycle) => {
    setPlan("premium");
    pushToast({ type: "success", title: "Upgraded to Premium", body: `Billed ${fmtMoney(PREMIUM_PRICE[cycle])} / ${cycle === "annual" ? "year" : "month"}. API keys and CSV export are now unlocked.` });
  };
  const downgradePlan = () => {
    setPlan("free");
    pushToast({ type: "warn", title: "Premium canceled", body: "You're back on the Standard plan — Premium features are now locked." });
  };

  const toggleAdjusterStatus = (id) => {
    setAdjusters((prev) => prev.map((a) => a.id === id ? { ...a, status: a.status === "active" ? "suspended" : "active" } : a));
    const a = adjusters.find((x) => x.id === id);
    if (a) pushToast({ type: a.status === "active" ? "warn" : "success", title: `${a.name} ${a.status === "active" ? "suspended" : "reactivated"}`, body: a.status === "active" ? "Their queue access has been revoked." : "Queue access has been restored." });
  };

  const togglePolicyholderStatus = (id) => {
    setPolicyholders((prev) => prev.map((p) => p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p));
    const p = policyholders.find((x) => x.id === id);
    if (p) pushToast({ type: p.status === "active" ? "warn" : "success", title: `${p.name} ${p.status === "active" ? "suspended" : "reactivated"}` });
  };

  const addAdjuster = (form) => {
    setAdjusters((prev) => [...prev, { id: uid("ADJ"), status: "active", joinedAt: NOW.toISOString().slice(0, 10), ...form }]);
  };

  const requestInfo = (id, notes) => {
    setClaims((prev) => prev.map((c) => c.id === id ? {
      ...c, status: "action_required", flagReason: notes,
      history: [...c.history,
        { ts: NOW.toISOString().replace("Z", ".118000"), label: "Adjuster flagged claim", detail: notes },
        { ts: NOW.toISOString().replace("Z", ".119000"), label: "Status changed to Action Required", detail: "Applicant notified via email + SMS" },
      ],
    } : c));
    pushToast({ type: "warn", title: `${id} flagged`, body: "Applicant has been notified to provide more info." });
  };

  const navAnchor = (id) => {
    if (screen === "landing") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setScrollTarget(id);
      setScreen("landing");
    }
  };

  const siteNav = {
    onNavAnchor: navAnchor,
    onDevelopers: () => setScreen("developers"),
    onGetStarted: () => setScreen("signup"),
    onLogin: () => setScreen("login"),
    onHome: () => { setScrollTarget(null); setScreen("landing"); },
    onFaq: () => setScreen("faq"),
    onBlog: () => setScreen("blog"),
    onPrivacy: () => setScreen("privacy"),
    onTerms: () => setScreen("terms"),
  };

  if (screen === "landing") {
    return (
      <SiteNavContext.Provider value={siteNav}>
        <Landing onGetStarted={siteNav.onGetStarted} onLogin={siteNav.onLogin} onExploreAdmin={() => enterApp("admin")} scrollTarget={scrollTarget} onScrolled={() => setScrollTarget(null)} />
      </SiteNavContext.Provider>
    );
  }
  if (screen === "developers") {
    return <SiteNavContext.Provider value={siteNav}><Developers /></SiteNavContext.Provider>;
  }
  if (screen === "faq") {
    return <SiteNavContext.Provider value={siteNav}><Faq /></SiteNavContext.Provider>;
  }
  if (screen === "blog") {
    return <SiteNavContext.Provider value={siteNav}><Blog /></SiteNavContext.Provider>;
  }
  if (screen === "privacy") {
    return <SiteNavContext.Provider value={siteNav}><Privacy /></SiteNavContext.Provider>;
  }
  if (screen === "terms") {
    return <SiteNavContext.Provider value={siteNav}><Terms /></SiteNavContext.Provider>;
  }
  if (screen === "signup") {
    return <SignUp onGoLogin={() => setScreen("login")} onSubmit={(form) => { setPendingEmail(form.email); setPendingRole(form.role); setScreen("verify"); }} />;
  }
  if (screen === "login") {
    return <Login onGoSignup={() => setScreen("signup")} onSubmit={(form) => enterApp(form.role)} onGoSuperAdmin={() => setScreen("superadmin-login")} />;
  }
  if (screen === "superadmin-login") {
    return <SuperAdminLogin onBack={() => setScreen("login")} onSubmit={() => enterApp("superadmin")} />;
  }
  if (screen === "verify") {
    return <VerifyEmail email={pendingEmail} onBack={() => setScreen("signup")} onVerified={() => enterApp(pendingRole)} />;
  }

  const selectedClaim = claims.find((c) => c.id === selected);
  const notifCount = claims.filter((c) => c.status === "action_required").length;

  let title = "Dashboard", subtitle = "";
  if (view === "new") title = "New Claim";
  if (view === "claims") title = "My Claims";
  if (view === "queue") title = "Claims Queue";
  if (view === "api") title = "Developer / API";
  if (view === "billing") title = "Plans & Billing";
  if (view === "sa-dashboard") title = "Super Admin Overview";
  if (view === "sa-claims") title = "All Claims";
  if (view === "sa-adjusters") title = "Adjusters";
  if (view === "sa-policyholders") title = "Policyholders";
  if (view === "detail" && selectedClaim) { title = selectedClaim.id; subtitle = selectedClaim.category; }

  return (
    <div className="min-h-screen flex bg-[#f5f6fa]">
      <Sidebar role={role} plan={plan} active={view} onNav={(v) => { setView(v); setSelected(null); }} onRoleSwitch={switchRole} onExit={exitApp} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar title={title} subtitle={subtitle} role={role} plan={plan} onMenu={() => setMobileOpen(true)} notifCount={notifCount} onBell={() => setNotifOpen((o) => !o)} />
        <main className="flex-1 p-4 sm:p-8">
          {role === "applicant" && view === "dashboard" && <ApplicantDashboard claims={claims} onNav={setView} onOpenClaim={openClaim} />}
          {role === "applicant" && view === "new" && <NewClaimWizard onSubmitClaim={addClaim} pushToast={pushToast} />}
          {role === "applicant" && view === "claims" && <MyClaims claims={claims} onOpenClaim={openClaim} onNav={setView} />}
          {role === "applicant" && view === "detail" && selectedClaim && <ClaimDetailApplicant claim={selectedClaim} onBack={() => setView("claims")} onReupload={reupload} onRate={rate} pushToast={pushToast} />}
          {role === "admin" && view === "dashboard" && <AdminDashboard claims={claims} onOpenClaim={openClaim} />}
          {role === "admin" && view === "queue" && <ClaimsQueue claims={claims} onOpenClaim={openClaim} plan={plan} onGoBilling={() => setView("billing")} pushToast={pushToast} />}
          {role === "admin" && view === "detail" && selectedClaim && <ClaimReview claim={selectedClaim} onBack={() => setView("queue")} onDecision={decide} onRequestInfo={requestInfo} pushToast={pushToast} />}
          {role === "admin" && view === "billing" && <Billing plan={plan} onUpgrade={upgradePlan} onDowngrade={downgradePlan} />}
          {role === "superadmin" && view === "sa-dashboard" && <SuperAdminDashboard claims={claims} adjusters={adjusters} policyholders={policyholders} onOpenClaim={openClaim} onNav={setView} />}
          {role === "superadmin" && view === "sa-claims" && <SuperAdminClaims claims={claims} adjusters={adjusters} onOpenClaim={openClaim} />}
          {role === "superadmin" && view === "sa-adjusters" && <SuperAdminAdjusters adjusters={adjusters} claims={claims} onToggleStatus={toggleAdjusterStatus} onAddAdjuster={addAdjuster} pushToast={pushToast} />}
          {role === "superadmin" && view === "sa-policyholders" && <SuperAdminPolicyholders policyholders={policyholders} claims={claims} onToggleStatus={togglePolicyholderStatus} pushToast={pushToast} onOpenClaim={openClaim} />}
          {role === "superadmin" && view === "detail" && selectedClaim && <ClaimReview claim={selectedClaim} onBack={() => setView("sa-claims")} onDecision={decide} onRequestInfo={requestInfo} pushToast={pushToast} readOnly />}
          {view === "api" && <ApiDocs role={role} plan={plan} onGoBilling={() => setView("billing")} pushToast={pushToast} />}
        </main>
      </div>
      <Toast toasts={toasts} />
      <NotifPanel open={notifOpen} onClose={() => setNotifOpen(false)} claims={claims} />
    </div>
  );
}
