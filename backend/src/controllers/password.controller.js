const passwordService = require("../services/password.service");

exports.forgotPassword = async (req, res, next) => {
  try {
    console.log("forgotPassword req.body:", req.body);

    const { email } = req.body;
    const data = await passwordService.forgotPassword(email);

    console.log("forgotPassword service response:", data);

    res.json({ success: true, ...data });
  } catch (err) {
    console.error("forgotPassword controller error:", err);
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    console.log("verifyOtp req.body:", req.body);

    const { email, otp } = req.body;
    const data = await passwordService.verifyOtp(email, otp);

    res.json({ success: true, ...data });
  } catch (err) {
    console.error("verifyOtp controller error:", err);
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    console.log("resetPassword req.body:", req.body);

    const { email, newPassword } = req.body;
    const data = await passwordService.resetPassword(email, newPassword);

    res.json({ success: true, ...data });
  } catch (err) {
    console.error("resetPassword controller error:", err);
    next(err);
  }
};