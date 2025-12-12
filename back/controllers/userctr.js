const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generateOTP, sendOTPEmail } = require("../utils/email");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      if (!existingUser.isVerified) {
        // Resend OTP if user exists but not verified
        const otp = generateOTP();
        existingUser.otp = otp;
        existingUser.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await existingUser.save();
        await sendOTPEmail(email, otp);
        return res.status(200).json({ 
          message: "OTP resent to your email",
          requiresVerification: true,
          email: email
        });
      }
      return res.status(400).json({ error: "User already exists" });
    }

    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword,
      otp: otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });
    
    await user.save();
    await sendOTPEmail(email, otp);
    
    res.status(201).json({ 
      message: "OTP sent to your email. Please verify to complete registration.",
      requiresVerification: true,
      email: email
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully! You can now login." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (!user.isVerified) {
      // Send new OTP for unverified users
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      await sendOTPEmail(email, otp);
      return res.status(403).json({ 
        error: "Email not verified. OTP sent to your email.",
        requiresVerification: true,
        email: email
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Session-based authentication
    req.session.userId = user._id;
    req.session.email = user.email;
    req.session.name = user.name;
    req.session.isAuthenticated = true;

    res.status(200).json({ 
      message: "Login successful",
      name: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Could not log out" });
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ message: "Logged out successfully" });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.checkSession = async (req, res) => {
  try {
    if (req.session && req.session.isAuthenticated) {
      res.status(200).json({ 
        isAuthenticated: true,
        name: req.session.name,
        email: req.session.email
      });
    } else {
      res.status(401).json({ isAuthenticated: false });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
