const router = require("express").Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const csrfProtection = require("../middlewares/csrfProtection");
const verifyUser = require("../middlewares/verifyUser");

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
      req.session.userId = user._id;

      const userInfo = JSON.stringify({ user: user.username, role: user.role });

      res
        .status(200)
        .cookie("user", userInfo, { maxAge: 1296000 * 1000 })
        .json({
          msg: "Registration Successful",
          expiresOn: 1296000, // 15 days in seconds
        });
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
    let user = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.email }],
    });

    if (!user) return res.status(404).json({ msg: "Invalid Credentials" });
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res.status(401).json({ msg: "Invalid Password" });

    req.session.userId = user._id;

    const userInfo = JSON.stringify({ user: user.username, role: user.role });

    res
      .status(200)
      .cookie("user", userInfo, { maxAge: 1296000 * 1000 })
      .json({
        msg: "Logged In",
        expiresOn: 1296000, // 15 days in seconds
      });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route  GET /api/auth/get-current-user
// @desc   Get current logged in user data
// @access Private

router.get(
  "/get-current-user",
  verifyUser,
  csrfProtection,
  async (req, res) => {
    // Get token value
    const userId = req.session.userId;

    try {
      const user = await User.findById(userId).select("-password");
      return res.status(200).json({
        user,
        csrfToken: req.csrfToken(),
      });
    } catch (err) {
      return res.status(500).json({ msg: "Server Error" });
    }
  }
);

// @route  POST /api/auth/logout
// @desc   Get current user logget out
// @access Private / Not Protected

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res
      .clearCookie("sid")
      .clearCookie("_csrf")
      .clearCookie("user")
      .status(200)
      .json({ msg: "Logged Out" });
  });
});

router.post("/csrfCheck", verifyUser, csrfProtection, (req, res) => {
  res.status(200).json({ msg: "Success", token: req.csrfToken() });
});

module.exports = router;
