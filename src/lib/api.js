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

export function verifyOtpRequest(email, otp) {
  return request("/verify-otp", { email, otp });
}

export function resendOtpRequest(email) {
  return request("/resend-otp", { email });
}

export function signupRequest(payload) {
  return request("/signup", payload);
}