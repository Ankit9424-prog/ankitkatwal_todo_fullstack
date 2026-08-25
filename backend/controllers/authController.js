// Ankit Katwal
const { UserStore } = require("../models/store");
const jwt = require("jsonwebtoken");

// Helper function to generate signed JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id: id.toString() },
    process.env.JWT_SECRET || "ankit_katwal_cse230_super_secret_jwt_key_2026",
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Please provide all required fields: name, email, password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const userExists = await UserStore.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        error: "Bad Request",
        message: "A user with this email address already exists",
      });
    }

    // Create user
    const user = await UserStore.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    if (user) {
      return res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid user data received",
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Please enter both email and password",
      });
    }

    // Find user by email
    const user = await UserStore.findOne({ email: email.toLowerCase().trim() });

    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid email or password credentials",
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private (Protected by JWT)
const getMe = async (req, res, next) => {
  try {
    const user = await UserStore.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        error: "Not Found",
        message: "User profile not found",
      });
    }
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Log out user (stateless confirmation)
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  res.status(200).json({
    message: "Logged out successfully. Client token discarded.",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
};
