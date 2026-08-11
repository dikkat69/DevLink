const User = require("../models/User");
const jwt = require("jsonwebtoken");

const verifyToken = async (token) => {
  if (!token) {
    throw new Error("Please Login");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { _id } = decoded;
  const user = await User.findById(_id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const UserAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Authentication Failed: " + err.message);
  }
};

module.exports = { UserAuth, verifyToken };
