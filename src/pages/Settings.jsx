import { useRef, useState } from "react";
import { Camera, Lock, Mail, Phone, Bell, ShieldCheck, User, Save } from "lucide-react";
import { Card, PageHeader, Field } from "../components/UI.jsx";

export default function Settings({ role, profile, onUpdateProfile, pushToast }) {
  const fileRef = useRef(null);
  const [form, setForm] = useState({ phone: profile.phone, notifyEmail: profile.notifyEmail, notifySms: profile.notifySms });
  const roleLabel = role === "admin" ? "Adjuster" : role === "superadmin" ? "Super Admin" : "Policyholder";

  const na = <span className="text-ink-300 italic font-normal">Not set</span>;
  const locked =
    role === "admin"
      ? [
          { label: "Full Legal Name", value: profile.fullName || na },
          { label: "Login Email", value: profile.email || na },
          { label: "Adjuster License / Staff ID", value: profile.licenseNumber || na },
          { label: "Organization", value: profile.orgName || na },
        ]
      : role === "superadmin"
      ? [
          { label: "Full Legal Name", value: profile.fullName || na },
          { label: "Login Email", value: profile.email || na },
          { label: "Access Level", value: "Full Platform Oversight" },
        ]
      : [
          { label: "Full Legal Name", value: profile.fullName || na },
          { label: "Login Email", value: profile.email || na },
          { label: "Policy Number", value: profile.policyId || na },
        ];

  const handleAvatarPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      pushToast({ type: "error", title: "Unsupported file", body: "Please choose an image file for your profile picture." });
      return;
    }
    const url = URL.createObjectURL(file);
    onUpdateProfile({ avatarUrl: url });
    pushToast({ type: "success", title: "Profile picture updated" });
  };

  const removeAvatar = () => {
    onUpdateProfile({ avatarUrl: null });
    pushToast({ type: "success", title: "Profile picture removed" });
  };

  const saveDetails = (e) => {
    e.preventDefault();
    onUpdateProfile({ phone: form.phone, notifyEmail: form.notifyEmail, notifySms: form.notifySms });
    pushToast({ type: "success", title: "Settings saved", body: "Your contact and notification preferences were updated." });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader eyebrow={roleLabel} title="Settings" subtitle="Manage your profile picture, contact details, and notification preferences." />

      <Card className="p-6">
        <p className="font-display font-semibold text-navy-900 mb-4">Profile Picture</p>
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-bearing-500 to-navy-800 text-white flex items-center justify-center overflow-hidden ring-4 ring-bearing-100 shrink-0">
            {profile.avatarUrl ? <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" /> : <User className="w-8 h-8" />}
          </div>
          <div className="flex flex-col gap-2 items-center sm:items-start w-full sm:w-auto">
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              <button onClick={() => fileRef.current?.click()} className="btn-primary text-sm">
                <Camera className="w-4 h-4" />Change Photo
              </button>
              {profile.avatarUrl && (
                <button onClick={removeAvatar} className="btn-ghost text-sm">Remove</button>
              )}
            </div>
            <p className="text-xs text-ink-500">JPG or PNG, square images look best.</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarPick} />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-4 h-4 text-ink-300" />
          <p className="font-display font-semibold text-navy-900">Account Details</p>
        </div>
        <p className="text-xs text-ink-500 mb-4">These fields are tied to your verified account and can't be changed here. Contact support if any of this needs correcting.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {locked.map((f) => (
            <div key={f.label} className="rounded-xl bg-ink-900/[0.03] border border-ink-900/6 px-4 py-3">
              <p className="text-[11px] font-semibold text-ink-500 uppercase flex items-center gap-1.5">{f.label}<Lock className="w-3 h-3" /></p>
              <p className="text-sm font-medium text-navy-900 mt-0.5">{f.value}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <p className="font-display font-semibold text-navy-900 mb-4">Contact &amp; Notifications</p>
        <form className="space-y-5" onSubmit={saveDetails}>
          <Field label="Phone Number">
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
              <input className="input pl-9" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+234 ..." />
            </div>
          </Field>
          <div>
            <p className="text-xs font-semibold text-ink-700 mb-2 flex items-center gap-1.5"><Bell className="w-3.5 h-3.5" />Notify me by</p>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2.5 text-sm text-ink-700">
                <input type="checkbox" checked={form.notifyEmail} onChange={(e) => setForm({ ...form, notifyEmail: e.target.checked })} className="w-4 h-4 rounded accent-bearing-600" />
                <Mail className="w-3.5 h-3.5 text-ink-500" />Email updates on claim status changes
              </label>
              <label className="flex items-center gap-2.5 text-sm text-ink-700">
                <input type="checkbox" checked={form.notifySms} onChange={(e) => setForm({ ...form, notifySms: e.target.checked })} className="w-4 h-4 rounded accent-bearing-600" />
                <Phone className="w-3.5 h-3.5 text-ink-500" />SMS alerts for urgent SLA warnings
              </label>
            </div>
          </div>
          <button type="submit" className="btn-primary"><Save className="w-4 h-4" />Save Changes</button>
        </form>
      </Card>

      <div className="flex items-start gap-2.5 text-xs text-ink-500 bg-navy-50/60 rounded-xl px-4 py-3">
        <ShieldCheck className="w-4 h-4 text-navy-700 shrink-0 mt-0.5" />
        Identity-linked information — legal name, login email, policy or employee numbers, and organization — is locked to protect your account and keep claims records accurate. Reach out to RightTrack support to update any of it.
      </div>
    </div>
  );
}
