import { useEffect, useState } from "react";
import { Plus, Trash2, Hash } from "lucide-react";
import { Card, Field, Modal } from "../../components/UI.jsx";
import { CATEGORY_META } from "../../lib/constants.js";
import { registerPolicyRequest, listPoliciesRequest, deactivatePolicyRequest } from "../../lib/api.js";

export default function ManagePolicies({ pushToast }) {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ policyId: "", category: Object.keys(CATEGORY_META)[0], policyholderEmail: "" });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    listPoliciesRequest()
      .then((res) => setPolicies(res.policies))
      .catch((err) => pushToast?.({ type: "warn", title: "Couldn't load policies", body: err.message }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.policyId.trim() || saving) return;
    setSaving(true);
    try {
      const res = await registerPolicyRequest(form.policyId.trim(), form.category, form.policyholderEmail.trim() || undefined);
      setPolicies((prev) => [res.policy, ...prev]);
      setForm({ policyId: "", category: Object.keys(CATEGORY_META)[0], policyholderEmail: "" });
      setAdding(false);
      pushToast?.({ type: "success", title: "Policy registered", body: `${res.policy.policyId} can now be used to file claims.` });
    } catch (err) {
      pushToast?.({ type: "warn", title: "Couldn't register policy", body: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (policy) => {
    try {
      await deactivatePolicyRequest(policy._id);
      setPolicies((prev) => prev.map((p) => (p._id === policy._id ? { ...p, isActive: false } : p)));
      pushToast?.({ type: "warn", title: "Policy deactivated", body: `${policy.policyId} can no longer be used for new claims.` });
    } catch (err) {
      pushToast?.({ type: "warn", title: "Couldn't deactivate policy", body: err.message });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900">Manage Policies</h1>
          <p className="text-sm text-ink-500 mt-1">Register the policy numbers your organization actually issues — only these can be used to file a claim.</p>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary text-sm"><Plus className="w-4 h-4" />Register Policy</button>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <p className="text-sm text-ink-400 text-center py-10">Loading…</p>
        ) : policies.length === 0 ? (
          <p className="text-sm text-ink-400 text-center py-10">No policies registered yet. Click "Register Policy" to add your first one.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-900/10 text-left text-ink-500">
                <th className="px-5 py-3 font-medium">Policy ID</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Restricted To</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p) => (
                <tr key={p._id} className="border-b border-ink-900/6 last:border-0">
                  <td className="px-5 py-3 font-semibold text-navy-900">{p.policyId}</td>
                  <td className="px-5 py-3 text-ink-700">{p.category}</td>
                  <td className="px-5 py-3 text-ink-500">{p.policyholderEmail || "Anyone with this number"}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.isActive ? "bg-emerald-50 text-emerald-700" : "bg-ink-900/5 text-ink-400"}`}>
                      {p.isActive ? "Active" : "Deactivated"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {p.isActive && (
                      <button onClick={() => handleDeactivate(p)} className="text-ink-400 hover:text-red-600" aria-label="Deactivate">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal open={adding} onClose={() => setAdding(false)}>
        <div className="p-6">
          <p className="font-display font-semibold text-navy-900 text-lg">Register a policy</p>
          <p className="text-xs text-ink-500 mt-1">Only exact matches to this number will be accepted when a policyholder files a claim.</p>
          <form onSubmit={handleAdd} className="space-y-4 mt-5">
            <Field label="Policy ID">
              <div className="relative">
                <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
                <input className="input pl-9" value={form.policyId} onChange={(e) => setForm({ ...form, policyId: e.target.value })} placeholder="e.g. LDW/2026/12345" required />
              </div>
            </Field>
            <Field label="Category">
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {Object.keys(CATEGORY_META).map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Restrict to a specific email (optional)">
              <input className="input" type="email" value={form.policyholderEmail} onChange={(e) => setForm({ ...form, policyholderEmail: e.target.value })} placeholder="policyholder@email.com" />
            </Field>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setAdding(false)} className="btn-ghost flex-1">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-40">{saving ? "Saving…" : "Register"}</button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
