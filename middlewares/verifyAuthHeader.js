const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Get auth bearer value
  const bearerHeader = req.header("Authorization");

  // Check if undefined
  if (typeof bearerHeader === "undefined" || !bearerHeader)
    return res.status(401).json({ msg: "Access denied, Please login first!" });

  // Split at space
  const bearer = bearerHeader.split(" ");

  // Get the token at second position
  const token = bearer[1];

  // Send the payload
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload.user;
    next();
  } catch (err) {
    res.status(400).json({ msg: "Invalid token" });
  }
};
