const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  phonenumber: {
    type: String
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  address: {
    type: String
  },
  type: {
    type: String,
    defailt: "user"
  }
});

module.exports = User = mongoose.model("user", UserSchema);
