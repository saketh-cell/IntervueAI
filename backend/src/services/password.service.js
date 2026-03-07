const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const sendEmail = require("../utils/sendEmail");
const { otpEmail } = require("../utils/emailTemplates");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return { message: "If email exists OTP sent" };
  }

  const otp = generateOTP();

  user.resetOtpHash = hashOtp(otp);
  user.resetOtpExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Password Reset OTP",
    html: otpEmail(otp),
  });

  return { message: "OTP sent to email" };
};

const verifyOtp = async (email, otp) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("Invalid OTP");

  const hashed = hashOtp(otp);

  if (hashed !== user.resetOtpHash) throw new Error("Invalid OTP");

  if (Date.now() > user.resetOtpExpire) throw new Error("OTP expired");

  user.resetOtpVerified = true;

  await user.save();

  return { message: "OTP verified" };
};

const resetPassword = async (email, newPassword) => {
  const user = await User.findOne({ email });

  if (!user.resetOtpVerified) throw new Error("OTP verification required");

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
