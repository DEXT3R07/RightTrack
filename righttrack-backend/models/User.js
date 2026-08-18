const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // stored as bcrypt hash

    role: { type: String, enum: ["applicant", "admin", "superadmin"], default: "applicant" },

    // Policy holder-specific
    policyNumber: { type: String, trim: true },

    // Adjuster-specific
    orgName: { type: String, trim: true },
    isRegisteredOrg: { type: Boolean, default: false },
    cac: { type: String, trim: true },
    licenseNumber: { type: String, trim: true },

    // --- OTP login fields ---
    otpHash: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    otpAttempts: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
