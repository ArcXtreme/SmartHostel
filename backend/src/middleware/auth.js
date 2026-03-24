const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "dev-insecure-secret";

function signToken(user) {
  return jwt.sign(
    { sub: String(user._id), role: user.role },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function requireAuth(roles) {
  const allowed = Array.isArray(roles) ? roles : null;
  return async (req, res, next) => {
    try {
      const header = req.headers.authorization || "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : null;
      if (!token) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const payload = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(payload.sub).select("-passwordHash");
      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }
      if (allowed && !allowed.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = user;
      req.token = token;
      next();
    } catch (e) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
}

function toPublicUser(userDoc) {
  const u = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete u.passwordHash;
  return u;
}

module.exports = { signToken, requireAuth, toPublicUser, JWT_SECRET };
