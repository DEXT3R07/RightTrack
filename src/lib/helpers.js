export const NOW = new Date();

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

export function insurerRatingStats(claims, insurer) {
  const rated = claims.filter((c) => c.insurer === insurer && c.rating);
  const avg = rated.length ? rated.reduce((s, c) => s + c.rating.stars, 0) / rated.length : 0;
  const reviews = rated
    .filter((c) => c.rating.review)
    .map((c) => ({ stars: c.rating.stars, review: c.rating.review, applicant: c.applicant }));
  return { count: rated.length, avg, reviews };
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

const escapeHtml = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function buildClaimReportHtml(claim, statusLabel) {
  const rows = [
    ["Claim ID", claim.id],
    ["Applicant", claim.applicant],
    ["Policy Number", claim.policyId],
    ["Insurer", claim.insurer],
    ["Category", claim.category],
    ["Claim Amount", fmtMoney(claim.amount)],
    ["Status", statusLabel || claim.status],
    ["Submitted On", fmtDateTime(claim.submittedAt)],
  ];

  const timelineRows = (claim.history || [])
    .map((h) => `<tr><td class="ts">${escapeHtml(fmtDateTime(h.ts))}</td><td><strong>${escapeHtml(h.label)}</strong>${h.detail ? `<div class="muted">${escapeHtml(h.detail)}</div>` : ""}</td></tr>`)
    .join("");

  const docRows = (claim.documents || [])
    .map((d) => `<li>${escapeHtml(d.name)} <span class="muted">(${escapeHtml(d.size)})</span></li>`)
    .join("");

  const rejectionBlock =
    claim.status === "rejected"
      ? `<div class="box box-red"><strong>Reason for rejection:</strong> ${escapeHtml(claim.rejectionCode)}. ${escapeHtml(claim.rejectionNotes)}</div>`
      : "";

  const ratingBlock =
    claim.rating
      ? `<div class="box"><strong>Policyholder rating:</strong> ${claim.rating.stars}/5${claim.rating.tags?.length ? " — " + claim.rating.tags.map(escapeHtml).join(", ") : ""}${claim.rating.review ? `<div class="muted">"${escapeHtml(claim.rating.review)}"</div>` : ""}</div>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Claim Report — ${escapeHtml(claim.id)}</title>
<style>
  body { font-family: -apple-system, Segoe UI, Inter, Arial, sans-serif; color: #0d1220; margin: 0; padding: 40px; background: #fff; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #0b1730; padding-bottom: 16px; margin-bottom: 24px; }
  .brand { font-weight: 700; font-size: 20px; color: #0b1730; letter-spacing: -0.02em; }
  .subtitle { color: #6b7280; font-size: 12px; margin-top: 4px; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  table.meta { width: 100%; border-collapse: collapse; margin: 20px 0; }
  table.meta td { padding: 8px 0; border-bottom: 1px solid #eef0f6; font-size: 13px; vertical-align: top; }
  table.meta td:first-child { color: #6b7280; width: 180px; }
  table.meta td:last-child { font-weight: 600; }
  h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.04em; color: #1e4fd9; margin: 28px 0 10px; }
  table.timeline { width: 100%; border-collapse: collapse; font-size: 13px; }
  table.timeline td { padding: 8px 0; border-bottom: 1px solid #eef0f6; vertical-align: top; }
  table.timeline td.ts { color: #6b7280; width: 190px; white-space: nowrap; }
  .muted { color: #6b7280; font-size: 12px; margin-top: 2px; }
  ul { margin: 0; padding-left: 18px; font-size: 13px; }
  li { margin-bottom: 4px; }
  .box { background: #f5f6fb; border-radius: 10px; padding: 14px 16px; font-size: 13px; margin-top: 8px; }
  .box-red { background: #fef2f2; color: #b91c1c; }
  .desc { font-size: 13px; line-height: 1.6; }
  .footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #eef0f6; font-size: 11px; color: #9aa1b4; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">RightTrack</div>
      <div class="subtitle">Claim Status Report</div>
    </div>
    <div class="subtitle">Generated ${escapeHtml(fmtDateTime(NOW))}</div>
  </div>

  <h1>Claim ${escapeHtml(claim.id)}</h1>
  <table class="meta">
    ${rows.map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`).join("")}
  </table>

  <h2>Description</h2>
  <p class="desc">${escapeHtml(claim.description)}</p>

  ${rejectionBlock}
  ${ratingBlock}

  <h2>Documents Submitted (${(claim.documents || []).length})</h2>
  <ul>${docRows || "<li>No documents on file</li>"}</ul>

  <h2>Claim Timeline</h2>
  <table class="timeline">${timelineRows}</table>

  <div class="footer">This report was generated from the RightTrack claims portal and reflects claim status as of the generation time above.</div>
</body>
</html>`;
}

export function downloadClaimReport(claim, statusLabel) {
  const html = buildClaimReportHtml(claim, statusLabel);
  const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${claim.id}-report.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}