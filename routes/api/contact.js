const express = require("express");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const contacts = await User.find({ type: "contact" }).sort({
      isFavourite: -1
    });
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
        res.status(500).json({ msg: "Failed to delete." });
      } else {
        res.status(200).json({ msg: "Contact deleted successfully" });
      }
    });
  } catch (error) {}
});

router.get("/:id", async (req, res) => {
  try {
    User.findById(req.params.id, function (err, docs) {
      if (err) {
        res.status(500).json({ msg: "Something went wrong" });
      } else {
        res.status(200).json({ user: docs });
      }
    });
  } catch (error) {}
});

router.post("/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body, function (err, docs) {
      if (err) {
        res.status(500).json({ msg: "Failed to update contact." });
      } else {
        res
          .status(200)
          .json({ msg: "Contact Updated successfully", user: docs });
      }
    });
  } catch (error) {}
});

router.post("/favourite/:id", async (req, res) => {
  try {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { isFavourite: req.body.isFavourite } },
      { new: true },
      async function (err, docs) {
        if (err) {
          res.status(500).json({ msg: "Failed to update contact." });
        } else {
          const contacts = await User.find({ type: "contact" }).sort({
            isFavourite: -1
          });
          res
            .status(200)
            .json({ msg: "Contact saved as favourite", user: docs, contacts });
        }
      }
    );
  } catch (error) {}
});

router.put("/profile/:id", async (req, res) => {
  try {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { profileUrl: req.body.profileUrl } },
      { new: true },
      async function (err, docs) {
        if (err) {
          res.status(500).json({ msg: "Failed to update profile." });
        } else {
          const contacts = await User.find({ type: "contact" }).sort({
            isFavourite: -1
          });
          res.status(200).json({
            msg: "Profile pic updated successfully",
            user: docs,
            contacts
          });
        }
      }
    );
  } catch (error) {}
});

module.exports = router;
