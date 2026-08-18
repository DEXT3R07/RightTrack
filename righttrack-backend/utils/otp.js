const crypto = require("crypto");

// Generates a 6-digit numeric OTP as a string, e.g. "042915"
function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

// We never store the raw OTP in the DB — only a SHA-256 hash of it.
// This way, even if the database is compromised, OTPs can't be read directly.
function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

function verifyOtp(rawOtp, hashedOtp) {
  return hashOtp(rawOtp) === hashedOtp;
}

module.exports = { generateOtp, hashOtp, verifyOtp };
