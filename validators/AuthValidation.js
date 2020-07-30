const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.email }],
    });
    if (!user) return res.status(404).json({ msg: "Invalid Credentials" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(401).json({ msg: "Invalid Password" });

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ msg: "Login Failed" });
  }
};
