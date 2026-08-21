const express = require("express");
const router = express.Router();
const { registerPolicy, listPolicies, deactivatePolicy, listMyPolicies } = require("../controllers/policiesController");
const { requireAuth, requireRole } = require("../middleware/auth");

// Adjuster-only management.
router.post("/", requireAuth, requireRole("admin"), registerPolicy);
router.get("/", requireAuth, requireRole("admin"), listPolicies);
router.patch("/:id/deactivate", requireAuth, requireRole("admin"), deactivatePolicy);

// Any logged-in user: see the policy numbers assigned to their own email.
router.get("/mine", requireAuth, listMyPolicies);

module.exports = router;
