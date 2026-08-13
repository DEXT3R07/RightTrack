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
