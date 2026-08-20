const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: {
      type: String,
      required: function () { return !this.isGoogleAccount; }, // Google accounts don't set a password
    },
    isGoogleAccount: { type: Boolean, default: false },

    role: { type: String, enum: ["applicant", "admin", "superadmin"], default: "applicant" },

    // Policy holder-specific
    policyNumber: { type: String, trim: true },

    // Adjuster-specific
    orgName: { type: String, trim: true },
    isRegisteredOrg: { type: Boolean, default: false },
    claimCategories: { type: [String], default: [] }, // which claim types this org handles
    cac: { type: String, trim: true },
    licenseNumber: { type: String, trim: true },

    // --- OTP login fields ---
    otpHash: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    otpAttempts: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },

    // --- Adjuster verification (Super Admin manually reviews License/CAC) ---
    verificationStatus: {
      type: String,
      enum: ["not_required", "pending", "approved", "rejected"],
      default: function () { return this.role === "admin" ? "pending" : "not_required"; },
    },
    verificationNote: { type: String, default: "" }, // optional reason if rejected
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
