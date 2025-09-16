var jwt = require('jsonwebtoken');
const AuthUser = require('../models/authUser');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "X-System-Secret12587", (err, decoded) => {
      if (err) {
        return res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkIfUser = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, "X-System-Secret12587");

      const loginUser = await AuthUser.findById(decoded.id);

      res.locals.user = loginUser;
      next();
    } catch (err) {
      console.error("JWT Error:", err.message);
      res.locals.user = null;
      next();
    }
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkIfUser };
