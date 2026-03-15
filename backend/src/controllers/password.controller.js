const passwordService = require("../services/password.service");

exports.forgotPassword = async (req, res, next) => {
  try {
    console.log("forgotPassword req.body:", req.body);

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const data = await passwordService.forgotPassword(email.trim().toLowerCase());

    console.log("forgotPassword service response:", data);

    return res.status(200).json({
      success: true,
      ...data,
    });
  } catch (err) {
    console.error("forgotPassword controller error:", err);
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    console.log("verifyOtp req.body:", req.body);

    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const data = await passwordService.verifyOtp(
      email.trim().toLowerCase(),
      otp.trim()
    );

    return res.status(200).json({
      success: true,
      ...data,
    });
  } catch (err) {
    console.error("verifyOtp controller error:", err);
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    console.log("resetPassword req.body:", req.body);

    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }

    const data = await passwordService.resetPassword(
      email.trim().toLowerCase(),
      newPassword
    );

    return res.status(200).json({
      success: true,
      ...data,
    });
  } catch (err) {
    console.error("resetPassword controller error:", err);
    next(err);
  }
};