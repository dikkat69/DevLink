const User = require("../models/User");
const jwt = require("jsonwebtoken");

const UserAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {

      return res.status(401).send("Please Login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decoded;

    const user = await User.findById(_id); 
    
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Authentication Failed: " + err.message);
  }
};

module.exports = { UserAuth };
