export const NOW = new Date("2026-08-11T14:20:00");

export const fmtMoney = (n) => "₦" + Number(n).toLocaleString("en-NG", { minimumFractionDigits: 0 });
export const fmtDate = (d) =>
  new Date(d).toLocaleString("en-NG", { day: "numeric", month: "short", year: "numeric" });
export const fmtDateTime = (d) =>
  new Date(d).toLocaleString("en-NG", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
export const fmtClock = (d) =>
  new Date(d).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }) +
  "." + String(new Date(d).getMilliseconds()).padStart(3, "0") + "000";

export const SLA_HOURS = 48;

export function slaInfo(claim) {
  const deadline = new Date(new Date(claim.submittedAt).getTime() + SLA_HOURS * 3600 * 1000);
  const terminal = claim.status === "approved" || claim.status === "rejected";
  const msLeft = deadline - NOW;
  const breached = !terminal && msLeft <= 0;
  const totalMs = SLA_HOURS * 3600 * 1000;
  const pct = terminal ? 100 : Math.max(0, Math.min(100, 100 - (msLeft / totalMs) * 100));
  let label;
  if (terminal) label = "Closed";
  else if (breached) label = "SLA Breached";
  else {
    const h = Math.floor(msLeft / 3600000), m = Math.floor((msLeft % 3600000) / 60000);
    label = `${h}h ${m}m remaining`;
  }
  return { deadline, breached, msLeft, pct, label, terminal };
}

export function uid(prefix) {
  return prefix + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function avgResolutionHours(claims) {
  const hours = claims
    .filter((c) => c.status === "approved" || c.status === "rejected")
    .map((c) => {
      const decision = [...c.history].reverse().find((h) => h.label.startsWith("Decision recorded"));
      if (!decision) return null;
      const hrs = (new Date(decision.ts) - new Date(c.submittedAt)) / 3600000;
      return hrs >= 0 ? hrs : null;
    })
    .filter((v) => v != null);
  if (!hours.length) return null;
  return hours.reduce((s, v) => s + v, 0) / hours.length;
}

export function last7DaysTrend(claims) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(NOW);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days.map((day) => {
    const dayKey = day.toDateString();
    const dayClaims = claims.filter((c) => new Date(c.submittedAt).toDateString() === dayKey);
    let onTime = 0, atRisk = 0, breached = 0;
    dayClaims.forEach((c) => {
      const s = slaInfo(c);
      if (s.breached) breached++;
      else if (!s.terminal && s.msLeft < 8 * 3600 * 1000) atRisk++;
      else onTime++;
    });
    return { d: day.toLocaleDateString("en-NG", { day: "numeric", month: "short" }), onTime, atRisk, breached };
  });
}
