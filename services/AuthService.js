const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const User = require("../models/User");
module.exports = (User) => ({
  register: async (body) => {
    const userExist = await User.findOne({ email: body.email });
    if (userExist)
      return res.status(403).json({
        msg: "E-mail already exists, please try a different e-mail address",
      });

    const allUsers = await User.find();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    // Creating Group and User

    const newUser = {
      name: body.name,
      username: body.username,
      email: body.email,
      password: hashedPassword,
      role: allUsers.length < 1 ? "Admin" : "Writer",
      createdAt: Date.now(),
    };

    return await User.create(newUser, (err, user) => {
      const payload = {
        user: {
          id: user._id,
          role: user.role,
        },
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          return { token };
        }
      );
    });
  },
  login: (user) => {
    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    return token;
  },
});
