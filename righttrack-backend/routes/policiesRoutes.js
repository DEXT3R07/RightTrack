const express = require("express");
const router = express.Router();
const { registerPolicy, listPolicies, deactivatePolicy } = require("../controllers/policiesController");
const { requireAuth, requireRole } = require("../middleware/auth");

// All policy management is adjuster-only.
router.post("/", requireAuth, requireRole("admin"), registerPolicy);
router.get("/", requireAuth, requireRole("admin"), listPolicies);
router.patch("/:id/deactivate", requireAuth, requireRole("admin"), deactivatePolicy);

module.exports = router;
