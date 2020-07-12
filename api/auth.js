const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// @route  POST /api/auth/register
// @desc   Register as an Admin
// @access Public

router.post("/register", async (req, res) => {
  // Checking if email exist
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist)
      return res.status(403).json({
        msg: "E-mail already exists, please try a different e-mail address",
      });

    const allUsers = await User.find();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Creating Group and User

    const newUser = {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: allUsers.length < 1 ? "Admin" : "Writer",
      createdAt: Date.now(),
    };

    await User.create(newUser, (err, user) => {
      const payload = {
        user: {
          id: user._id,
        },
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          return res.status(200).json({
            msg: "Group and User created",
            token: token,
            expiresIn: 3600,
          });
        }
      );
    });
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

// @route  POST /api/auth/login
// @desc   Login to the Admin Panel on the basis of User Role
// @access Public

router.post("/login", async (req, res) => {
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

    // console.log(Date().now().toString());
    const payload = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        return res
          .status(200)
          .json({ msg: "Logged In", token: token, expiresIn: 3600 });
      }
    );
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
