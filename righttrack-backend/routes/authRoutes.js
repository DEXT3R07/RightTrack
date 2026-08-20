const express = require("express");
const router = express.Router();
const { signup, login, verifyOtpHandler, resendOtp, me, googleAuth } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

// POST /api/auth/signup       -> creates the account
router.post("/signup", signup);

// POST /api/auth/login        -> checks email+password, sends OTP
router.post("/login", login);

// POST /api/auth/google       -> verifies Google ID token, logs in directly
router.post("/google", googleAuth);

// POST /api/auth/verify-otp   -> checks OTP, returns JWT
router.post("/verify-otp", verifyOtpHandler);

// POST /api/auth/resend-otp   -> sends a new OTP if the old one expired
router.post("/resend-otp", resendOtp);

// GET  /api/auth/me           -> returns current user if token is valid
router.get("/me", requireAuth, me);

module.exports = router;