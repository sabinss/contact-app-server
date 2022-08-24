const express = require("express");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const contacts = await User.find({ type: "contact" });
    return res.status(200).json({ contacts });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.post(
  "/",
  [
    check("name", "Please include a valid username").exists(),
    check("email", "Enter valid email").isEmail(),
    check("phonenumber", "Please enter valid phonenumber").isLength({
      min: 10,
      max: 10
    })
  ],
  async (req, res) => {
    try {
      console.log("create contqact", req.user);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name, email, phonenumber, address = "" } = req.body;

      let user = await User.findOne({ email });

      if (user) {
        return res.status(401).json({ msg: "Contact already exist" });
      }

      const newContact = new User({
        name,
        email,
        phonenumber,
        address,
        type: "contact"
      });
      await newContact.save();

      res.status(201).json({ msg: "New contact created successfully." });
    } catch (err) {
      res.status(500).json({ msg: err });
    }
  }
);

router.delete("/:id", async (req, res) => {
  try {
    User.findByIdAndDelete(req.params.id, function (err, docs) {
      if (err) {
        console.log(err);
        res.status(500).json({ msg: "Failed to delete." });
      } else {
        console.log("Deleted : ", docs);
        res.status(200).json({ msg: "Contact deleted successfully" });
      }
    });
  } catch (error) {}
});

module.exports = router;
