const Policy = require("../models/Policy");
const User = require("../models/User");

/**
 * POST /api/policies
 * Body: { policyId, category, policyholderEmail? }
 * Adjuster registers a valid policy number for their own organization.
 */
async function registerPolicy(req, res) {
  try {
    const { policyId, category, policyholderEmail } = req.body;
    if (!policyId || !category) {
      return res.status(400).json({ message: "Policy ID and category are required." });
    }

    const adjuster = await User.findById(req.user.id).select("orgName");
    if (!adjuster?.orgName) {
      return res.status(400).json({ message: "Your account has no organization on file." });
    }

    const existing = await Policy.findOne({ policyId: policyId.trim(), insurer: adjuster.orgName });
    if (existing) {
      return res.status(409).json({ message: "This policy ID is already registered for your organization." });
    }

    const policy = await Policy.create({
      policyId: policyId.trim(),
      insurer: adjuster.orgName,
      category,
      policyholderEmail: policyholderEmail ? policyholderEmail.toLowerCase().trim() : null,
      registeredBy: req.user.id,
    });

    return res.status(201).json({ policy });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "This policy ID is already registered for your organization." });
    }
    console.error("Register policy error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

/**
 * GET /api/policies
 * Adjuster: lists policies registered for their own organization.
 */
async function listPolicies(req, res) {
  try {
    const adjuster = await User.findById(req.user.id).select("orgName");
    const policies = await Policy.find({ insurer: adjuster?.orgName }).sort({ createdAt: -1 });
    return res.status(200).json({ policies });
  } catch (err) {
    console.error("List policies error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

/**
 * PATCH /api/policies/:id/deactivate
 * Adjuster: deactivates a policy so it can no longer be used for new claims.
 */
async function deactivatePolicy(req, res) {
  try {
    const adjuster = await User.findById(req.user.id).select("orgName");
    const policy = await Policy.findOneAndUpdate(
      { _id: req.params.id, insurer: adjuster?.orgName },
      { isActive: false },
      { new: true }
    );
    if (!policy) return res.status(404).json({ message: "Policy not found." });
    return res.status(200).json({ policy });
  } catch (err) {
    console.error("Deactivate policy error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

/**
 * Used internally by claimsController to validate a claim's Policy ID
 * against what's genuinely on file for that insurer + category.
 */
async function findValidPolicy(policyId, insurer, category) {
  return Policy.findOne({
    policyId: (policyId || "").trim(),
    insurer,
    category,
    isActive: true,
  });
}

module.exports = { registerPolicy, listPolicies, deactivatePolicy, findValidPolicy };
