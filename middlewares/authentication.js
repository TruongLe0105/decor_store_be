const jwt = require("jsonwebtoken");
const { AppError } = require("../helpers/utils");
const User = require("../models/User");
const { checkObjectId } = require("./validator");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authMiddleware = {};

authMiddleware.loginRequired = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) {
      throw new AppError(401, "Token is Missing", "Login Require Error");
    }
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        throw new AppError(401, "Token Error", "Login Require Error");
      }
      checkObjectId(payload._id);
      req.currentUserId = payload._id; //undefiend
    });
    next();
  } catch (error) {
    next(error);
  }
};

authMiddleware.adminRequired = async (req, res, next) => {
  try {
    const userId = req.currentUserId;
    const currentAdmin = await User.findById(userId);
    const isAdmin = currentAdmin.role === "admin";

    if (!isAdmin) return next(new Error("401- Admin required"));
    req.isAdmin = isAdmin;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
