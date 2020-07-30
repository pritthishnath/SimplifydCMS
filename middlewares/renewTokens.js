// const jwt = require("jsonwebtoken");
const TokenService = require("../services/TokenService");

module.exports = async (req, res, next) => {
  const jwtToken = req.cookies.id_token;

  if (!jwtToken)
    return res.status(401).json({ msg: "Access denied, Please login first!" });

  const [token, refreshToken, interval] = await TokenService.refreshTokens(
    jwtToken,
    req.cookies.refresh_token
  );

  if (!token) return res.status(401).json({ msg: refreshToken });

  req.newTokens = {
    token,
    refreshToken,
    interval,
  };
  next();
};
