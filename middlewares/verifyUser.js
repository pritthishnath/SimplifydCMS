module.exports = async (req, res, next) => {
  if (!req.session.userId)
    return res.status(401).json({ msg: "Access denied, Please login first!" });
  next();
};
