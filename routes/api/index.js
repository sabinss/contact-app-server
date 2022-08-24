const express = require("express");
const router = express.Router();
const authenticateRequest = require("../../middleware/authenticateRequest");

const authRoute = require("./auth");

const contactRoute = require("./contact");

router.use("/auth", authRoute);
router.use("/contacts", authenticateRequest, contactRoute);

module.exports = router;
