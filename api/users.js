const router = require("express").Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User");

// @route  GET /api/users/get-current-user
// @desc   Get current logged in user data

router.get("/get-current-user", async (req, res) => {
  // Get token value
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select("-password");
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ msg: "Server Error" });
  }
});

// @route  POST /api/users/create-user
// @desc   Create a User

router.post("/create-user", async (req, res) => {
  // Checking if email exist
  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) return res.status(403).json({ msg: "Email already exists" });

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const password = await req.body.password;
  const hashedPassword = await bcrypt.hash(password, salt);

  // Get token payload

  // Creating user
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
    createdAt: new Date(),
  };
  try {
    await User.create(user);
    return res.status(200).json({ msg: "New User Added" });
  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
});

// @route  GET /api/users/get-user/:id
// @desc   Get a user

router.get("/get-user/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
});

// @route  GET /api/users/get-users
// @desc   Get all users

router.get("/get-users", async (req, res) => {
  // Get token value

  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ msg: "Server Error" });
  }
});

// @route  DELETE /api/users/delete-user/:id
// @desc   Delete a user

router.delete("/delete-user/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await User.findByIdAndRemove(id);
    return res.status(200).json({ msg: "User Removed" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
