const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";

async function request(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data;
}

export function loginRequest(email, password) {
  return request("/login", { email, password });
}

export function verifyOtpRequest(email, otp, remember = false) {
  return request("/verify-otp", { email, otp, remember });
}

export function resendOtpRequest(email) {
  return request("/resend-otp", { email });
}

export function signupRequest(payload) {
  return request("/signup", payload);
}

export function googleAuthRequest(credential, role, remember) {
  return request("/google", { credential, role, remember });
}

export function forgotPasswordRequest(email) {
  return request("/forgot-password", { email });
}

export function verifyResetOtpRequest(email, otp) {
  return request("/verify-reset-otp", { email, otp });
}

export function resetPasswordRequest(email, otp, newPassword) {
  return request("/reset-password", { email, otp, newPassword });
}

export async function meRequest(token) {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Session expired.");
  }
  return data;
}

const ADMIN_BASE_URL = BASE_URL.replace(/\/auth$/, "/admin");

export async function listPendingAdjustersRequest() {
  const res = await fetch(`${ADMIN_BASE_URL}/pending-adjusters`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Couldn't load pending adjusters.");
  return data;
}

export async function approveAdjusterRequest(id) {
  const res = await fetch(`${ADMIN_BASE_URL}/adjusters/${id}/approve`, { method: "PATCH" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Couldn't approve adjuster.");
  return data;
}

export async function rejectAdjusterRequest(id, note) {
  const res = await fetch(`${ADMIN_BASE_URL}/adjusters/${id}/reject`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Couldn't reject adjuster.");
  return data;
}