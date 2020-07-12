const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Get auth bearer value
  const token = req.query.key;

  // Check if undefined
  if (!token)
    return res.status(401).json({ msg: "Access denied, Please login first!" });

  // Send the payload
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Access denied, Please login first!" });
  }
};
