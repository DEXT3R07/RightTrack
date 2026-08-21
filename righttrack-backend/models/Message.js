const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    claim: { type: mongoose.Schema.Types.ObjectId, ref: "Claim", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderName: { type: String, required: true },
    senderRole: { type: String, enum: ["applicant", "admin", "superadmin"], required: true },
    body: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);