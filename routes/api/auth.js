const express = require("express");
const gravatar = require("gravatar");

const router = express.Router();

const User = require("../../models/User");

const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

router.get("/login", (req, res) => {
  res.json({ message: "Sign in successfully" });
});

router.post(
  "/signup",
  [
    check("email", "Please include valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more character"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    var avatar = gravatar.profile_url(email, {
      protocol: "https"
    });
    try {
      let user = await User.findOne({ email });

      if (user) {
        res.status(500).send("User already exist");
      }

      user = new User({
        email,
        avatar
      });
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res.send("User registered successfully");
    } catch (err) {
      console.log("User signup error", err);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
