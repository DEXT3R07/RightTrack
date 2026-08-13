import { useState, useRef } from "react";
import { Mail, Lock, ArrowLeft, User, Hash, Building2, BadgeCheck, ShieldCheck, UserRound, ShieldAlert } from "lucide-react";
import Logo from "../components/Logo.jsx";
import { SUPERADMIN_CREDENTIALS } from "../lib/constants.js";

function AuthShell({ children, wide }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-navy-950">
      <div className="absolute inset-0">
        <img src="/bg-compass.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950/90 via-navy-950/90 to-navy-950/95" />
      </div>
      <div className={`relative w-full ${wide ? "max-w-lg" : "max-w-md"} bg-white rounded-3xl shadow-pop p-8 animate-fadein`}>{children}</div>
    </div>
  );
}

function GoogleButton() {
  return (
    <button type="button" className="w-full flex items-center justify-center gap-2.5 border border-ink-900/12 rounded-xl py-2.5 text-sm font-semibold text-ink-700 hover:bg-navy-50/60 transition">
      <svg viewBox="0 0 24 24" className="w-4 h-4">
        <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82Z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.11A12 12 0 0 0 12 24Z" />
        <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.28A12 12 0 0 0 0 12c0 1.93.47 3.76 1.28 5.39l3.99-3.11Z" />
        <path fill="#EA4335" d="M12 4.75c1.76 0 3.35.6 4.6 1.79l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.61l3.99 3.11C6.22 6.86 8.87 4.75 12 4.75Z" />
      </svg>
      Continue with Google
    </button>
  );
}

function TextField({ label, icon: Icon, hint, ...inputProps }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-700 mb-1.5 block">{label}</span>
      <div className="relative">
        {Icon && <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />}
        <input {...inputProps} className={`input ${Icon ? "pl-9" : ""}`} />
      </div>
      {hint && <span className="text-[11px] text-ink-400 mt-1 block">{hint}</span>}
    </label>
  );
}

const ROLE_OPTIONS = [
  {
    id: "applicant",
    label: "Policy Holder",
    icon: UserRound,
    blurb: "File and track your own claims",
  },
  {
    id: "admin",
    label: "Adjuster",
    icon: ShieldCheck,
    blurb: "Review and process claims for an organization",
  },
];

function RoleToggle({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2 mb-6" role="radiogroup" aria-label="Account type">
      {ROLE_OPTIONS.map((r) => {
        const active = value === r.id;
        const Icon = r.icon;
        return (
          <button
            key={r.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(r.id)}
            className={`text-left rounded-xl border p-3 transition ${
              active ? "border-bearing-600 bg-bearing-100/60 ring-1 ring-bearing-600" : "border-ink-900/12 hover:bg-navy-50/60"
            }`}
          >
            <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${active ? "text-navy-900" : "text-ink-700"}`}>
              <Icon className="w-4 h-4" />{r.label}
            </span>
            <span className="block text-[11px] text-ink-500 mt-1 leading-snug">{r.blurb}</span>
          </button>
        );
      })}
    </div>
  );
}

const emptyPolicyHolder = { fullName: "", policyNumber: "", email: "", password: "", confirm: "" };
const emptyAdjuster = { fullName: "", orgName: "", isRegisteredOrg: true, cac: "", licenseNumber: "", email: "", password: "", confirm: "" };

export function SignUp({ onSubmit, onGoLogin }) {
  const [role, setRole] = useState("applicant");
  const [policyHolder, setPolicyHolder] = useState(emptyPolicyHolder);
  const [adjuster, setAdjuster] = useState(emptyAdjuster);
  const [remember, setRemember] = useState(false);

  const form = role === "applicant" ? policyHolder : adjuster;
  const setForm = role === "applicant" ? setPolicyHolder : setAdjuster;

  const passwordsOk = form.password.length >= 6 && form.password === form.confirm;
  const baseOk = form.fullName.trim().length > 1 && form.email.includes("@") && passwordsOk;
  const canSubmit =
    role === "applicant"
      ? baseOk && policyHolder.policyNumber.trim().length > 0
      : baseOk && adjuster.orgName.trim().length > 0 && adjuster.licenseNumber.trim().length > 0 && (!adjuster.isRegisteredOrg || adjuster.cac.trim().length > 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ role, remember, ...form });
  };

  return (
    <AuthShell wide>
      <div className="flex justify-center mb-6"><Logo size="lg" /></div>
      <h1 className="font-display text-xl font-semibold text-navy-900 text-center">Sign up</h1>
      <p className="text-sm text-ink-500 text-center mt-1">Tell us which kind of account you need</p>

      <div className="mt-6">
        <RoleToggle value={role} onChange={setRole} />
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          icon={User}
          type="text"
          required
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          placeholder="Enter your full name"
        />

        {role === "applicant" ? (
          <TextField
            label="Policy Number"
            icon={Hash}
            type="text"
            required
            value={policyHolder.policyNumber}
            onChange={(e) => setPolicyHolder({ ...policyHolder, policyNumber: e.target.value })}
            placeholder="e.g. LDW/2026/12345"
            hint="Found on your policy schedule or welcome letter."
          />
        ) : (
          <>
            <TextField
              label="Organization Name"
              icon={Building2}
              type="text"
              required
              value={adjuster.orgName}
              onChange={(e) => setAdjuster({ ...adjuster, orgName: e.target.value })}
              placeholder="e.g. Right Track Insurance Ltd"
            />
            <TextField
              label="Adjuster License / Staff ID"
              icon={BadgeCheck}
              type="text"
              required
              value={adjuster.licenseNumber}
              onChange={(e) => setAdjuster({ ...adjuster, licenseNumber: e.target.value })}
              placeholder="e.g. NAICOM-ADJ-00214"
            />
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={adjuster.isRegisteredOrg}
                onChange={(e) => setAdjuster({ ...adjuster, isRegisteredOrg: e.target.checked, cac: e.target.checked ? adjuster.cac : "" })}
                className="rounded border-ink-900/20"
              />
              I'm signing up on behalf of a CAC-registered organization
            </label>
            {adjuster.isRegisteredOrg && (
              <TextField
                label="CAC Registration Number"
                icon={Hash}
                type="text"
                required
                value={adjuster.cac}
                onChange={(e) => setAdjuster({ ...adjuster, cac: e.target.value })}
                placeholder="e.g. RC 1234567"
                hint="Required for registered organizations — Corporate Affairs Commission number."
              />
            )}
          </>
        )}

        <TextField
          label="Email Address"
          icon={Mail}
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Enter your email address"
        />
        <TextField
          label="Password"
          icon={Lock}
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Enter your password"
        />
        <TextField
          label="Confirm Password"
          icon={Lock}
          type="password"
          required
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          placeholder="Confirm password"
        />

        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded border-ink-900/20" />
          Remember me
        </label>
        <button type="submit" disabled={!canSubmit} className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
          Sign up as {role === "applicant" ? "Policy Holder" : "Adjuster"}
        </button>
        <div className="flex items-center gap-3 text-xs text-ink-300"><div className="h-px bg-ink-900/10 flex-1" />OR<div className="h-px bg-ink-900/10 flex-1" /></div>
        <GoogleButton />
      </form>
      <p className="text-sm text-ink-500 text-center mt-6">
        Already have an account? <button onClick={onGoLogin} className="font-semibold text-bearing-600 hover:underline">Log in</button>
      </p>
    </AuthShell>
  );
}

export function Login({ onSubmit, onGoSignup, onGoSuperAdmin }) {
  const [role, setRole] = useState("applicant");
  const [form, setForm] = useState({ email: "", password: "" });
  const canSubmit = form.email.includes("@") && form.password.length > 0;

  return (
    <AuthShell>
      <div className="flex justify-center mb-6"><Logo size="lg" /></div>
      <h1 className="font-display text-xl font-semibold text-navy-900 text-center">Log in</h1>
      <p className="text-sm text-ink-500 text-center mt-1">Log into your account</p>

      <div className="mt-6">
        <RoleToggle value={role} onChange={setRole} />
      </div>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (canSubmit) onSubmit({ role, ...form }); }}>
        <TextField
          label="Email Address"
          icon={Mail}
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Enter your email address"
        />
        <TextField
          label="Password"
          icon={Lock}
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Enter your password"
        />
        <div className="text-right -mt-2"><button type="button" className="text-xs font-semibold text-bearing-600 hover:underline">Forgotten password?</button></div>
        <button type="submit" disabled={!canSubmit} className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
          Log in as {role === "applicant" ? "Policy Holder" : "Adjuster"}
        </button>
        <div className="flex items-center gap-3 text-xs text-ink-300"><div className="h-px bg-ink-900/10 flex-1" />OR<div className="h-px bg-ink-900/10 flex-1" /></div>
        <GoogleButton />
      </form>
      <p className="text-sm text-ink-500 text-center mt-6">
        New to RightTrack? <button onClick={onGoSignup} className="font-semibold text-bearing-600 hover:underline">Sign up</button>
      </p>
      {onGoSuperAdmin && (
        <p className="text-xs text-ink-300 text-center mt-3">
          <button onClick={onGoSuperAdmin} className="inline-flex items-center gap-1 font-semibold text-ink-500 hover:text-navy-900">
            <ShieldAlert className="w-3.5 h-3.5" />Super Admin login
          </button>
        </p>
      )}
    </AuthShell>
  );
}

export function SuperAdminLogin({ onSubmit, onBack }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.email.trim().toLowerCase() === SUPERADMIN_CREDENTIALS.email && form.password === SUPERADMIN_CREDENTIALS.password) {
      setError("");
      onSubmit();
    } else {
      setError("Incorrect email or password for the Super Admin account.");
    }
  };

  return (
    <AuthShell>
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-navy-900 mb-4"><ArrowLeft className="w-4 h-4" />Back</button>
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-2xl bg-navy-900 flex items-center justify-center text-white"><ShieldAlert className="w-6 h-6" /></div>
      </div>
      <h1 className="font-display text-xl font-semibold text-navy-900 text-center">Super Admin</h1>
      <p className="text-sm text-ink-500 text-center mt-1">Restricted access — platform oversight console</p>

      <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
        <TextField
          label="Admin Email"
          icon={Mail}
          type="email"
          required
          value={form.email}
          onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(""); }}
          placeholder="superadmin@righttrack.africa"
        />
        <TextField
          label="Password"
          icon={Lock}
          type="password"
          required
          value={form.password}
          onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(""); }}
          placeholder="Enter password"
        />
        {error && <p className="text-xs font-medium text-red-600 bg-red-50 ring-1 ring-red-200 rounded-lg px-3 py-2">{error}</p>}
        <button type="submit" className="btn-primary w-full">Enter Super Admin Console</button>
      </form>
      <p className="text-[11px] text-ink-300 text-center mt-6">This account manages the whole platform — policyholders, adjusters, and every claim in the system.</p>
    </AuthShell>
  );
}

export function VerifyEmail({ email, onVerified, onBack }) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const refs = useRef([]);
  const complete = digits.every((d) => d !== "");

  const update = (i, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };
  const onKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  return (
    <AuthShell>
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-navy-900 mb-4"><ArrowLeft className="w-4 h-4" />Back</button>
      <div className="flex justify-center mb-6"><Logo size="lg" /></div>
      <h1 className="font-display text-xl font-semibold text-navy-900 text-center">Verify email</h1>
      <p className="text-sm text-ink-500 text-center mt-1">We've sent a 6-digit code to {email || "your email"}<br />It expires soon — check your inbox (and spam).</p>
      <div className="flex justify-center gap-2 mt-6">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            value={d}
            onChange={(e) => update(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            maxLength={1}
            inputMode="numeric"
            className="w-11 h-12 text-center text-lg font-semibold rounded-xl border border-ink-900/12 focus:border-bearing-600 focus:ring-2 focus:ring-bearing-100 outline-none"
          />
        ))}
      </div>
      <button onClick={onVerified} disabled={!complete} className="btn-primary w-full mt-6 disabled:opacity-40 disabled:cursor-not-allowed">Verify</button>
      <p className="text-sm text-ink-500 text-center mt-4">Didn't receive a code? <button className="font-semibold text-bearing-600 hover:underline">Request a new one</button></p>
    </AuthShell>
  );
}
