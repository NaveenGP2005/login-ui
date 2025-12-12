const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Decentra Solve - Email Verification OTP",
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #c2410c; text-align: center;">Team ForgeX</h2>
                <div style="background: linear-gradient(135deg, #fed7aa, #bbf7d0); padding: 30px; border-radius: 10px;">
                    <h3 style="color: #15803d; text-align: center;">Email Verification</h3>
                    <p style="color: #374151; text-align: center;">Your OTP for email verification is:</p>
                    <h1 style="color: #c2410c; text-align: center; font-size: 36px; letter-spacing: 8px;">${otp}</h1>
                    <p style="color: #374151; text-align: center;">This OTP is valid for 10 minutes.</p>
                    <p style="color: #6b7280; text-align: center; font-size: 12px;">If you didn't request this, please ignore this email.</p>
                </div>
            </div>
        `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { generateOTP, sendOTPEmail };
