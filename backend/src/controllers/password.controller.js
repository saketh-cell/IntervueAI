const passwordService = require("../services/password.service");

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const data = await passwordService.forgotPassword(email);

    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const data = await passwordService.verifyOtp(email, otp);

    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    const data = await passwordService.resetPassword(email, newPassword);

    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};
