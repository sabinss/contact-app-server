const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  //get token from header
  const token = req.header("Authorization").split(" ")[1];

  //check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  //verfiy token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded;
    console.log("decoded", decoded);
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
