const express = require('express');
const User = require('../models/User'); 
const { validateSignupData } = require('../utils/validator');
const bcrypt = require('bcrypt');

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
  try {
    validateSignupData(req.body);

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

     const savedUser = await user.save();

    const token = await savedUser.getJWT();
    res.cookie("token", token, { httpOnly: true });
    res.json({ message: "User Signed Up Successfully", data: savedUser });
  } catch (err) {
    res.status(500).send("Error Signing Up User - " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = await user.getJWT();
    res.cookie("token", token, { httpOnly: true });
    res.send(user);

  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async(req, res) => {

  res.clearCookie("token");
  res.send("Logout Successful!!!");
});

module.exports = authRouter;
