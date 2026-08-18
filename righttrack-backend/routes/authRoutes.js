const express = require("express");
const router = express.Router();
const { signup, login, verifyOtpHandler, resendOtp } = require("../controllers/authController");

// POST /api/auth/signup       -> creates the account
router.post("/signup", signup);

// POST /api/auth/login        -> checks email+password, sends OTP
router.post("/login", login);

// POST /api/auth/verify-otp   -> checks OTP, returns JWT
router.post("/verify-otp", verifyOtpHandler);

// POST /api/auth/resend-otp   -> sends a new OTP if the old one expired
router.post("/resend-otp", resendOtp);

module.exports = router;
