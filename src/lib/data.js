export const seedClaims = [
  { id: "CLM-89532", applicant: "Daniel Benson", policyId: "LDW/2026/12345", category: "Health", amount: 250000, adjuster: "T. Balogun", description: "Emergency room visit and diagnostic tests following a road traffic accident on Allen Avenue.", submittedAt: "2026-08-09T09:15:00", status: "under_review", documents: [{ name: "accident_photo.jpg", size: "2.1MB", url: "/mock-docs/accident-photo.jpg" }, { name: "hospital_bill.pdf", size: "1.4MB" }, { name: "diagnosis_report.pdf", size: "820KB" }], history: [
      { ts: "2026-08-09T09:15:00.418000", label: "Claim submitted", detail: "Submitted by applicant via web portal" },
      { ts: "2026-08-09T09:15:04.902000", label: "Document validation passed", detail: "2 files verified — PDF, within size limits" },
      { ts: "2026-08-09T09:22:11.005000", label: "Assigned to adjuster", detail: "Auto-assigned to Reviewing Officer — Claims Unit 2" },
      { ts: "2026-08-09T11:40:33.771000", label: "Status changed to Under Review", detail: "Adjuster opened claim file" },
    ] },
  { id: "CLM-89210", applicant: "Chidinma Okafor", policyId: "TUI/2026/00981", category: "Tuition/Loan", amount: 480000, adjuster: "B. Umar", description: "Second semester tuition reimbursement request under the staff education support policy.", submittedAt: "2026-08-07T08:02:00", status: "action_required", documents: [{ name: "school_invoice.pdf", size: "610KB" }], history: [
      { ts: "2026-08-07T08:02:00.113000", label: "Claim submitted", detail: "Submitted by applicant via mobile app" },
      { ts: "2026-08-07T08:02:03.220000", label: "Document validation passed", detail: "1 file verified" },
      { ts: "2026-08-07T14:10:09.408000", label: "Status changed to Under Review", detail: "Assigned to Adjuster — B. Umar" },
      { ts: "2026-08-08T10:05:47.902000", label: "Adjuster flagged claim", detail: "Requested clearer copy of school invoice — figures illegible" },
      { ts: "2026-08-08T10:05:48.001000", label: "Status changed to Action Required", detail: "Applicant notified via email + SMS" },
    ], flagReason: "The uploaded invoice is partially illegible. Please upload a clearer scan or photo showing the full amount breakdown." },
  { id: "CLM-88774", applicant: "Ifeoma Nwosu", policyId: "EXP/2026/22190", category: "Expense Reimbursement", amount: 96000, adjuster: "F. Adeyemi", description: "Field travel expense reimbursement for client site visit, Lagos–Ibadan route.", submittedAt: "2026-08-08T16:30:00", status: "under_review", documents: [{ name: "receipts_bundle.pdf", size: "2.0MB" }, { name: "travel_approval.pdf", size: "410KB" }], history: [
      { ts: "2026-08-08T16:30:00.220000", label: "Claim submitted", detail: "Submitted by applicant via web portal" },
      { ts: "2026-08-08T16:30:02.550000", label: "Document validation passed", detail: "2 files verified" },
      { ts: "2026-08-09T09:00:12.884000", label: "Status changed to Under Review", detail: "Assigned to Adjuster — F. Adeyemi" },
      { ts: "2026-08-10T13:20:00.019000", label: "SLA warning issued", detail: "6 hours remaining — reminder sent to adjuster queue" },
    ] },
  { id: "CLM-87990", applicant: "Tobi Fashina", policyId: "WAR/2026/55021", category: "Warranty", amount: 145000, adjuster: "B. Umar", description: "Warranty claim for laptop motherboard replacement under extended device protection plan.", submittedAt: "2026-08-06T10:00:00", status: "rejected", documents: [{ name: "device_photo.jpg", size: "1.8MB", url: "/mock-docs/device-damage.jpg" }, { name: "device_diagnostic.pdf", size: "1.1MB" }], rejectionCode: "Incident Outside Coverage Period", rejectionNotes: "The device's protection plan expired on 2026-07-30, prior to the reported fault date.", history: [
      { ts: "2026-08-06T10:00:00.301000", label: "Claim submitted", detail: "Submitted by applicant" },
      { ts: "2026-08-06T15:44:20.552000", label: "Status changed to Under Review", detail: "Assigned to Adjuster — B. Umar" },
      { ts: "2026-08-07T09:12:31.664000", label: "Decision recorded: Rejected", detail: "Reason: Incident Outside Coverage Period" },
    ], rating: null },
  { id: "CLM-87102", applicant: "Grace Etim", policyId: "HLT/2026/70044", category: "Health", amount: 320000, adjuster: "F. Adeyemi", description: "Surgical procedure reimbursement claim, in-patient admission 3 nights.", submittedAt: "2026-08-05T07:45:00", status: "approved", documents: [{ name: "hospital_invoice.pdf", size: "1.8MB" }, { name: "discharge_summary.pdf", size: "540KB" }], history: [
      { ts: "2026-08-05T07:45:00.117000", label: "Claim submitted", detail: "Submitted by applicant" },
      { ts: "2026-08-05T12:03:44.229000", label: "Status changed to Under Review", detail: "Assigned to Adjuster — F. Adeyemi" },
      { ts: "2026-08-06T16:51:09.887000", label: "Decision recorded: Approved", detail: "Full amount approved — payout scheduled" },
    ], rating: { stars: 5, tags: ["Fast Payout", "Clear Communication"], review: "Smooth process, kept me updated the whole way." } },
  { id: "CLM-89601", applicant: "Emeka Chukwu", policyId: "TUI/2026/01187", category: "Tuition/Loan", amount: 610000, adjuster: "B. Umar", description: "Full-year tuition loan claim for postgraduate diploma programme.", submittedAt: "2026-08-09T20:10:00", status: "under_review", documents: [{ name: "admission_letter.pdf", size: "300KB" }, { name: "fee_schedule.pdf", size: "460KB" }], history: [
      { ts: "2026-08-09T20:10:00.774000", label: "Claim submitted", detail: "Submitted by applicant via web portal" },
      { ts: "2026-08-09T20:10:03.010000", label: "Document validation passed", detail: "2 files verified" },
      { ts: "2026-08-10T08:15:19.339000", label: "Status changed to Under Review", detail: "Assigned to Adjuster — B. Umar" },
    ] },
  { id: "CLM-86550", applicant: "Amaka Bello", policyId: "EXP/2026/19087", category: "Expense Reimbursement", amount: 58000, adjuster: "F. Adeyemi", description: "Reimbursement for client dinner and transport during Q3 partner conference.", submittedAt: "2026-08-04T09:00:00", status: "approved", documents: [{ name: "receipts.pdf", size: "700KB" }], history: [
      { ts: "2026-08-04T09:00:00.220000", label: "Claim submitted", detail: "Submitted by applicant" },
      { ts: "2026-08-04T15:30:00.552000", label: "Status changed to Under Review", detail: "Assigned to Adjuster — F. Adeyemi" },
      { ts: "2026-08-05T11:02:00.771000", label: "Decision recorded: Approved", detail: "Approved in full" },
    ], rating: { stars: 4, tags: ["Fast Payout", "Easy Process"], review: "Straightforward, no back-and-forth needed." } },
];

export const seedAdjusters = [
  { id: "ADJ-001", name: "B. Umar", email: "b.umar@righttrack.africa", phone: "+234 802 114 7723", unit: "Claims Unit 1", status: "active", joinedAt: "2024-02-12" },
  { id: "ADJ-002", name: "F. Adeyemi", email: "f.adeyemi@righttrack.africa", phone: "+234 803 559 0142", unit: "Claims Unit 2", status: "active", joinedAt: "2023-11-03" },
  { id: "ADJ-003", name: "T. Balogun", email: "t.balogun@righttrack.africa", phone: "+234 705 220 8891", unit: "Claims Unit 2", status: "active", joinedAt: "2025-06-19" },
  { id: "ADJ-004", name: "K. Nnamdi", email: "k.nnamdi@righttrack.africa", phone: "+234 810 447 3390", unit: "Claims Unit 1", status: "suspended", joinedAt: "2024-09-01" },
];

export const seedPolicyholders = [
  { id: "PH-001", name: "Daniel Benson", email: "daniel.benson@mail.com", phone: "+234 806 213 4471", policyId: "LDW/2026/12345", plan: "Life & Wellness Duo", status: "active", joinedAt: "2025-03-14" },
  { id: "PH-002", name: "Chidinma Okafor", email: "c.okafor@mail.com", phone: "+234 701 998 2214", policyId: "TUI/2026/00981", plan: "Staff Tuition Support", status: "active", joinedAt: "2025-01-22" },
  { id: "PH-003", name: "Ifeoma Nwosu", email: "ifeoma.nwosu@mail.com", phone: "+234 812 664 0037", policyId: "EXP/2026/22190", plan: "Corporate Expense Cover", status: "active", joinedAt: "2024-11-08" },
  { id: "PH-004", name: "Tobi Fashina", email: "tobi.fashina@mail.com", phone: "+234 703 340 9912", policyId: "WAR/2026/55021", plan: "Device Protection Plus", status: "active", joinedAt: "2025-05-30" },
  { id: "PH-005", name: "Grace Etim", email: "grace.etim@mail.com", phone: "+234 809 771 5563", policyId: "HLT/2026/70044", plan: "Health Shield Premium", status: "active", joinedAt: "2024-07-19" },
  { id: "PH-006", name: "Emeka Chukwu", email: "emeka.chukwu@mail.com", phone: "+234 815 226 8804", policyId: "TUI/2026/01187", plan: "Staff Tuition Support", status: "active", joinedAt: "2025-02-11" },
  { id: "PH-007", name: "Amaka Bello", email: "amaka.bello@mail.com", phone: "+234 802 990 1128", policyId: "EXP/2026/19087", plan: "Corporate Expense Cover", status: "active", joinedAt: "2024-12-05" },
  { id: "PH-008", name: "Segun Adisa", email: "segun.adisa@mail.com", phone: "+234 706 552 3390", policyId: "LDW/2026/13098", plan: "Life & Wellness Duo", status: "inactive", joinedAt: "2023-08-27" },
];
