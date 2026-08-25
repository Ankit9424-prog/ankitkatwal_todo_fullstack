// Ankit Katwal
const jwt = require("jsonwebtoken");
const { UserStore } = require("../models/store");

const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "ankit_katwal_cse230_super_secret_jwt_key_2026"
      );

      // Get user from token
      req.user = await UserStore.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({
          error: "Unauthorized",
          message: "User account associated with token no longer exists",
        });
      }

      return next();
    } catch (error) {
      console.error(`[Auth Middleware Error] ${error.message}`);
      return res.status(401).json({
        error: "Unauthorized",
        message: "Not authorized, token validation failed",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Not authorized, no bearer token provided in header",
    });
  }
};

module.exports = { protect };
