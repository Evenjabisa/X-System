const jwt = require('jsonwebtoken');
const AuthUser = require('../models/authUser');

// Middleware to protect routes
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.redirect("/login");
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY);
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.redirect("/login");
  }
};

// Middleware to check if user is logged in
const checkIfUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.locals.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const loginUser = await AuthUser.findById(decoded.id);
    res.locals.user = loginUser || null;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkIfUser };
