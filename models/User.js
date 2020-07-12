const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  role: String,
  createdAt: Date,
});

module.exports = User = mongoose.model("user", UserSchema);
