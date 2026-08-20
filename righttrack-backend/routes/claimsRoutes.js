const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const {
  listClaims,
  createClaim,
  reuploadDocuments,
  rateClaim,
  startReview,
  requestInfo,
  decideClaim,
} = require("../controllers/claimsController");

// GET  /api/claims                  -> list claims scoped to the logged-in user's role
router.get("/", requireAuth, listClaims);

// POST /api/claims                  -> applicant submits a new claim
router.post("/", requireAuth, createClaim);

// PATCH /api/claims/:id/reupload    -> applicant responds to a flagged claim
router.patch("/:id/reupload", requireAuth, reuploadDocuments);

// PATCH /api/claims/:id/rate        -> applicant rates a resolved claim
router.patch("/:id/rate", requireAuth, rateClaim);

// PATCH /api/claims/:id/start-review -> adjuster opens a submitted claim
router.patch("/:id/start-review", requireAuth, startReview);

// PATCH /api/claims/:id/request-info -> adjuster flags a claim for more info
router.patch("/:id/request-info", requireAuth, requestInfo);

// PATCH /api/claims/:id/decide      -> adjuster/superadmin approves or rejects
router.patch("/:id/decide", requireAuth, decideClaim);

module.exports = router;