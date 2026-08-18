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
import { SignUp, Login, VerifyEmail, SuperAdminLogin, ForgotPassword } from "./pages/Auth.jsx";
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
import Settings from "./pages/Settings.jsx";
import { seedClaims, seedAdjusters, seedPolicyholders } from "./lib/data.js";
import { NOW, fmtMoney, uid } from "./lib/helpers.js";
import { PREMIUM_PRICE, PREMIUM_TRIAL_DAYS, SUPERADMIN_CREDENTIALS } from "./lib/constants.js";
import { SiteNavContext } from "./lib/SiteNav.jsx";
import { loginRequest, verifyOtpRequest, resendOtpRequest, signupRequest } from "./lib/api.js";

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [scrollTarget, setScrollTarget] = useState(null);
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingRole, setPendingRole] = useState("applicant");
  const [signupRole, setSignupRole] = useState("applicant");
  const [pendingSignup, setPendingSignup] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [otpResendStatus, setOtpResendStatus] = useState("");
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
  const [profile, setProfile] = useState({ avatarUrl: null, fullName: "", email: "", phone: "", policyId: "", plan: "", orgName: "", licenseNumber: "", notifyEmail: true, notifySms: false });
  const updateProfile = (patch) => setProfile((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    if (screen === "landing" && scrollTarget) return;
    window.scrollTo(0, 0);
  }, [screen]);

  const pushToast = (t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4200);
  };

  const enterApp = (r = "applicant", identity = null) => {
    setRole(r);
    setScreen("app");
    setView(r === "superadmin" ? "sa-dashboard" : "dashboard");
    if (r === "superadmin") {
      setProfile((prev) => ({ ...prev, fullName: "System Administrator", email: SUPERADMIN_CREDENTIALS.email }));
    } else if (identity) {
      setProfile((prev) => ({
        ...prev,
        fullName: identity.fullName || "",
        email: identity.email || "",
        policyId: identity.policyNumber || "",
        orgName: identity.orgName || "",
        licenseNumber: identity.licenseNumber || "",
      }));
    }
  };

  const exitApp = () => { setScreen("landing"); setView("dashboard"); setSelected(null); };
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

  const startTrial = () => {
    setPlan("trial");
    pushToast({ type: "success", title: "Free trial started", body: `Your ${PREMIUM_TRIAL_DAYS}-day free trial is active. API keys and CSV export are now unlocked — cancel anytime.` });
  };
  const upgradePlan = (cycle) => {
    setPlan("premium");
    pushToast({ type: "success", title: "Subscription active", body: `Billed ${fmtMoney(PREMIUM_PRICE[cycle])} / ${cycle === "annual" ? "year" : "month"}. API keys and CSV export are now unlocked.` });
  };
  const downgradePlan = () => {
    const wasTrial = plan === "trial";
    setPlan("free");
    pushToast({ type: "warn", title: wasTrial ? "Trial canceled" : "Subscription canceled", body: "You're back on the free plan — subscriber-only features are now locked." });
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
    onGetStarted: () => { setSignupRole("applicant"); setScreen("signup"); },
    onLogin: () => setScreen("login"),
    onHome: () => { setScrollTarget(null); setScreen("landing"); },
    onFaq: () => setScreen("faq"),
    onBlog: () => setScreen("blog"),
    onPrivacy: () => setScreen("privacy"),
    onTerms: () => setScreen("terms"),
  };
  const goSignupAsAdjuster = () => { setSignupRole("admin"); setScreen("signup"); };

  if (screen === "landing") {
    return (
      <SiteNavContext.Provider value={siteNav}>
        <Landing onGetStarted={siteNav.onGetStarted} onGetStartedAdjuster={goSignupAsAdjuster} onLogin={siteNav.onLogin} scrollTarget={scrollTarget} onScrolled={() => setScrollTarget(null)} />
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
  const handleGoogleAuth = () => {
    pushToast({ type: "warn", title: "Google sign-in isn't connected yet", body: "This button is wired and ready — we'll enable it once Google OAuth is set up." });
  };

  if (screen === "signup") {
    return (
      <SignUp
        initialRole={signupRole}
        onGoLogin={() => setScreen("login")}
        onSubmit={async (form) => {
          setAuthLoading(true);
          setAuthError("");
          try {
            await signupRequest(form);
            pushToast({ type: "success", title: "Account created", body: "You can now log in with your new account." });
            setScreen("login");
          } catch (err) {
            pushToast({ type: "warn", title: "Sign up failed", body: err.message });
          } finally {
            setAuthLoading(false);
          }
        }}
        onGoogleAuth={handleGoogleAuth}
        loading={authLoading}
      />
    );
  }
  if (screen === "login") {
    return (
      <Login
        onGoSignup={() => setScreen("signup")}
        onSubmit={async (form) => {
          setAuthLoading(true);
          setAuthError("");
          try {
            await loginRequest(form.email, form.password);
            setPendingEmail(form.email);
            setPendingRole(form.role);
            setOtpResendStatus("");
            setScreen("login-verify");
          } catch (err) {
            setAuthError(err.message);
          } finally {
            setAuthLoading(false);
          }
        }}
        onGoSuperAdmin={() => setScreen("superadmin-login")}
        onForgotPassword={() => setScreen("forgot-password")}
        onGoogleAuth={handleGoogleAuth}
        loading={authLoading}
        error={authError}
      />
    );
  }
  if (screen === "login-verify") {
    return (
      <VerifyEmail
        email={pendingEmail}
        onBack={() => { setAuthError(""); setScreen("login"); }}
        loading={authLoading}
        error={authError}
        resendStatus={otpResendStatus}
        onVerified={async (otp) => {
          setAuthLoading(true);
          setAuthError("");
          try {
            const res = await verifyOtpRequest(pendingEmail, otp);
            localStorage.setItem("rt_token", res.token);
            enterApp(res.user.role, res.user);
          } catch (err) {
            setAuthError(err.message);
          } finally {
            setAuthLoading(false);
          }
        }}
        onResend={async () => {
          setOtpResendStatus("Sending…");
          try {
            await resendOtpRequest(pendingEmail);
            setOtpResendStatus("A new code has been sent.");
          } catch (err) {
            setOtpResendStatus(err.message);
          }
        }}
      />
    );
  }
  if (screen === "forgot-password") {
    return <ForgotPassword onBack={() => setScreen("login")} onDone={() => setScreen("login")} />;
  }
  if (screen === "superadmin-login") {
    return <SuperAdminLogin onBack={() => setScreen("login")} onSubmit={() => enterApp("superadmin")} />;
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
  if (view === "settings") title = "Settings";
  if (view === "detail" && selectedClaim) { title = selectedClaim.id; subtitle = selectedClaim.category; }

  return (
    <div className="min-h-screen flex bg-[#f5f6fa]">
      <Sidebar role={role} plan={plan} active={view} onNav={(v) => { setView(v); setSelected(null); }} onExit={exitApp} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar title={title} subtitle={subtitle} role={role} plan={plan} onMenu={() => setMobileOpen(true)} notifCount={notifCount} onBell={() => setNotifOpen((o) => !o)} onSettings={() => setView("settings")} avatarUrl={profile.avatarUrl} profile={profile} />
        <main className="flex-1 p-4 sm:p-8">
          {role === "applicant" && view === "dashboard" && <ApplicantDashboard claims={claims} onNav={setView} onOpenClaim={openClaim} profile={profile} />}
          {role === "applicant" && view === "new" && <NewClaimWizard onSubmitClaim={addClaim} pushToast={pushToast} />}
          {role === "applicant" && view === "claims" && <MyClaims claims={claims} onOpenClaim={openClaim} onNav={setView} />}
          {role === "applicant" && view === "detail" && selectedClaim && <ClaimDetailApplicant claim={selectedClaim} onBack={() => setView("claims")} onReupload={reupload} onRate={rate} pushToast={pushToast} />}
          {role === "admin" && view === "dashboard" && <AdminDashboard claims={claims} onOpenClaim={openClaim} profile={profile} />}
          {role === "admin" && view === "queue" && <ClaimsQueue claims={claims} onOpenClaim={openClaim} plan={plan} onGoBilling={() => setView("billing")} pushToast={pushToast} />}
          {role === "admin" && view === "detail" && selectedClaim && <ClaimReview claim={selectedClaim} onBack={() => setView("queue")} onDecision={decide} onRequestInfo={requestInfo} pushToast={pushToast} />}
          {role === "admin" && view === "billing" && <Billing plan={plan} onUpgrade={upgradePlan} onDowngrade={downgradePlan} onStartTrial={startTrial} />}
          {role === "superadmin" && view === "sa-dashboard" && <SuperAdminDashboard claims={claims} adjusters={adjusters} policyholders={policyholders} onOpenClaim={openClaim} onNav={setView} />}
          {role === "superadmin" && view === "sa-claims" && <SuperAdminClaims claims={claims} adjusters={adjusters} onOpenClaim={openClaim} />}
          {role === "superadmin" && view === "sa-adjusters" && <SuperAdminAdjusters adjusters={adjusters} claims={claims} onToggleStatus={toggleAdjusterStatus} onAddAdjuster={addAdjuster} pushToast={pushToast} />}
          {role === "superadmin" && view === "sa-policyholders" && <SuperAdminPolicyholders policyholders={policyholders} claims={claims} onToggleStatus={togglePolicyholderStatus} pushToast={pushToast} onOpenClaim={openClaim} />}
          {role === "superadmin" && view === "detail" && selectedClaim && <ClaimReview claim={selectedClaim} onBack={() => setView("sa-claims")} onDecision={decide} onRequestInfo={requestInfo} pushToast={pushToast} readOnly />}
          {view === "api" && <ApiDocs role={role} plan={plan} onGoBilling={() => setView("billing")} pushToast={pushToast} />}
          {view === "settings" && <Settings role={role} profile={profile} onUpdateProfile={updateProfile} pushToast={pushToast} />}
        </main>
      </div>
      <Toast toasts={toasts} />
      <NotifPanel open={notifOpen} onClose={() => setNotifOpen(false)} claims={claims} />
    </div>
  );
}