export const CATEGORY_META = {
  Health: { color: "#1e4fd9", bg: "#e8edfd" },
  "Tuition/Loan": { color: "#a9821f", bg: "#f8f0da" },
  "Expense Reimbursement": { color: "#0f7a52", bg: "#e2f6ee" },
  Warranty: { color: "#7c3aed", bg: "#f0e9fe" },
};

export const STATUS_META = {
  submitted: { label: "Submitted", cls: "bg-slate-100 text-slate-700 ring-slate-200" },
  under_review: { label: "Under Review", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  action_required: { label: "Action Required", cls: "bg-rose-50 text-rose-700 ring-rose-200" },
  approved: { label: "Approved", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  rejected: { label: "Rejected", cls: "bg-red-50 text-red-700 ring-red-200" },
};

export const REJECTION_CODES = [
  "Insufficient Documentation",
  "Policy Exclusion Applies",
  "Claim Amount Exceeds Coverage",
  "Duplicate Claim Detected",
  "Incident Outside Coverage Period",
];

export const RATING_TAGS = ["Fast Payout", "Clear Communication", "Easy Process", "Unhelpful Reason", "Slow Response", "Fair Decision"];

export const ACCEPTED_TYPES = ["application/pdf", "image/png", "image/jpeg"];
export const MAX_SIZE_MB = 10;

export const PREMIUM_PRICE = { monthly: 35000, annual: 420000 };

export const SUPERADMIN_CREDENTIALS = {
  email: "superadmin@righttrack.africa",
  password: "RightTrack@Super2026",
};

export const ADJUSTER_STATUS_META = {
  active: { label: "Active", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  suspended: { label: "Suspended", cls: "bg-red-50 text-red-700 ring-red-200" },
};

export const POLICYHOLDER_STATUS_META = {
  active: { label: "Active", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  inactive: { label: "Inactive", cls: "bg-slate-100 text-slate-600 ring-slate-200" },
};

export const PLAN_FEATURES = {
  free: [
    "Submit & review claims",
    "Claims queue & SLA tracking",
    "Core dashboard analytics",
    "Manual claim decisions",
  ],
  premium: [
    "Everything in Standard",
    "API key generation & webhook access",
    "CSV / bulk data export",
    "Team performance analytics",
    "Priority SLA breach alerts",
  ],
};
