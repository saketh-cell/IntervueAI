const express = require("express");

const router = express.Router();

const {
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("../controllers/password.controller");

router.get("/ping", (req, res) => {
  res.json({ ok: true });
});

router.post("/forgot-password", forgotPassword);

router.post("/verify-otp", verifyOtp);

router.post("/reset-password", resetPassword);

module.exports = router;
