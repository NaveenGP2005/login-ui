const express = require("express");
const {
  signupvalidator,
  loginvalidator,
  otpvalidator,
} = require("../middlewares/auth");
const {
  signup,
  login,
  verifyOTP,
  resendOTP,
  logout,
  checkSession,
} = require("../controllers/userctr");
const router = express.Router();

router.post("/signup", signupvalidator, signup);
router.post("/login", loginvalidator, login);
router.post("/verify-otp", otpvalidator, verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/logout", logout);
router.get("/check-session", checkSession);

module.exports = router;
