const express = require("express");
const router = express.Router();
const { listPendingAdjusters, approveAdjuster, rejectAdjuster } = require("../controllers/adminController");

// NOTE: Your Super Admin login is currently a frontend-only check (hardcoded
// credentials in SUPERADMIN_CREDENTIALS), not a real backend account/JWT.
// These routes are therefore not JWT-protected yet — anyone who knows the
// URL could call them. That matches your current security level (the
// Super Admin screen itself isn't backend-verified either), but before this
// goes anywhere public, give Super Admin a real backend login + JWT and
// protect these with requireAuth + a role check, the same way /me works.

router.get("/pending-adjusters", listPendingAdjusters);
router.patch("/adjusters/:id/approve", approveAdjuster);
router.patch("/adjusters/:id/reject", rejectAdjuster);

module.exports = router;