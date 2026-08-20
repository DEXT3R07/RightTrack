const User = require("../models/User");

/**
 * GET /api/admin/pending-adjusters
 * Returns every adjuster account awaiting review, with the fields
 * a Super Admin needs to manually check (org, license, CAC).
 */
async function listPendingAdjusters(req, res) {
  try {
    const adjusters = await User.find({ role: "admin", verificationStatus: "pending" })
      .select("fullName email orgName licenseNumber cac isRegisteredOrg createdAt")
      .sort({ createdAt: 1 });

    return res.status(200).json({ adjusters });
  } catch (err) {
    console.error("List pending adjusters error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

/**
 * PATCH /api/admin/adjusters/:id/approve
 */
async function approveAdjuster(req, res) {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: "admin" },
      { verificationStatus: "approved", verificationNote: "" },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "Adjuster not found." });
    return res.status(200).json({ message: `${user.fullName} approved.`, user });
  } catch (err) {
    console.error("Approve adjuster error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

/**
 * PATCH /api/admin/adjusters/:id/reject
 * Body: { note } — optional reason shown to the adjuster.
 */
async function rejectAdjuster(req, res) {
  try {
    const { note } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: "admin" },
      { verificationStatus: "rejected", verificationNote: note || "" },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "Adjuster not found." });
    return res.status(200).json({ message: `${user.fullName} rejected.`, user });
  } catch (err) {
    console.error("Reject adjuster error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

module.exports = { listPendingAdjusters, approveAdjuster, rejectAdjuster };