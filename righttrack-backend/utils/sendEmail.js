const nodemailer = require("nodemailer");

// Configure via .env — works with Gmail (app password), SendGrid SMTP,
// or any standard SMTP provider. Swap values in .env, no code changes needed.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // e.g. smtp.gmail.com
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === "465", // true for port 465, false for others
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify the SMTP connection once at startup so config problems show up
// immediately in the terminal instead of failing silently later.
transporter.verify((err) => {
  if (err) {
    console.error("SMTP configuration error:", err.message);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

async function sendOtpEmail(toEmail, otp) {
  const mailOptions = {
    from: `"Right Track OTP" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Your RightTrack verification code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #0B2545;">RightTrack Verification</h2>
        <p>Use the code below to complete your login. This code expires in 5 minutes.</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0B2545; background: #E8F6F1; padding: 16px; text-align: center; border-radius: 8px;">
          ${otp}
        </p>
        <p style="color: #667085; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`OTP email sent to ${toEmail} — messageId: ${info.messageId}, response: ${info.response}`);
  return info;
}

module.exports = { sendOtpEmail };