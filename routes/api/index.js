const express = require("express");
const router = express.Router();

const authRoute = require("./auth");

const contactRoute = require("./contact");

router.use("/auth", authRoute);
router.use("/contacts", contactRoute);

module.exports = router;
