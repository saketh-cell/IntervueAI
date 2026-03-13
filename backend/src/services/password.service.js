const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const sendEmail = require("../utils/sendEmail");
const { otpEmail } = require("../utils/emailTemplates");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");

const forgotPassword = async (email) => {
  console.log("Service forgotPassword email:", email);

  if (!email) {
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email });
  console.log("User found:", !!user);

  if (!user) {
    return { message: "If email exists OTP sent" };
  }

  const otp = generateOTP();
  console.log("Generated OTP");

  user.resetOtpHash = hashOtp(otp);
  user.resetOtpExpire = Date.now() + 10 * 60 * 1000;
  user.resetOtpVerified = false;

  await user.save();
  console.log("OTP saved to DB");

  const html = otpEmail(otp);
  console.log("OTP email template created");

  await sendEmail({
    to: user.email,
    subject: "Password Reset OTP",
    html,
  });

  console.log("sendEmail finished");

  return { message: "OTP sent to email" };
};

const verifyOtp = async (email, otp) => {
  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  const user = await User.findOne({ email });

  if (!user) throw new Error("Invalid OTP");

  const hashed = hashOtp(otp);

  if (hashed !== user.resetOtpHash) throw new Error("Invalid OTP");

  if (!user.resetOtpExpire || Date.now() > user.resetOtpExpire) {
    throw new Error("OTP expired");
  }

  user.resetOtpVerified = true;
  await user.save();

  return { message: "OTP verified" };
};

const resetPassword = async (email, newPassword) => {
  if (!email || !newPassword) {
    throw new Error("Email and new password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.resetOtpVerified) {
    throw new Error("OTP verification required");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  user.resetOtpHash = undefined;
  user.resetOtpExpire = undefined;
  user.resetOtpVerified = false;

  await user.save();

  return { message: "Password updated" };
};

module.exports = {
  forgotPassword,
  verifyOtp,
  resetPassword,
};