const express = require("express");
const gravatar = require("gravatar");

const router = express.Router();

const User = require("../../models/User");

const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

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

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log("sfsd");
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ error: [{ msg: "Invalid credintials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const payload = {
        user: {
          id: user.id,
          email
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "2 days" },
        (err, token) => {
          if (err) throw err;
          //remove password from user and return to client TODO
          res.json({ token, user });
        }
      );
    } catch (err) {}
  }
);

module.exports = router;
