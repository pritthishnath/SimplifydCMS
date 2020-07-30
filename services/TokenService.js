const jwt = require("jsonwebtoken");

const User = require("../models/User");

module.exports = {
  createTokens: function (user) {
    const payload = {
      id: user._id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 10,
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });
    return [token, refreshToken, 10];
  },

  refreshTokens: async function (token, refreshToken) {
    let returnValue = [null, "Initial", null];
    try {
      jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (error) {
      return (returnValue = [
        null,
        "Refresh Token Expired, Please Login",
        null,
      ]);
    }

    const tokenPayload = jwt.decode(token);
    const refreshTokenPayload = jwt.decode(refreshToken);

    if (tokenPayload.id !== refreshTokenPayload.id)
      return (returnValue = [null, "Wrong User Token", null]);

    let userDoc = await User.findOne({ _id: tokenPayload.id });

    userDoc.keystore.forEach((key) => {
      if (key.id_token === token) {
        if (key.refresh_token === refreshToken) {
          const [newToken, newRefreshToken, expiration] = this.createTokens(
            userDoc
          );
          return (returnValue = [newToken, newRefreshToken, expiration]);
        } else {
          return (returnValue = [null, "Invaid Refresh Token", null]);
        }
      } else {
        return (returnValue = [null, "Invalid Access Token", null]);
      }
    });

    if (returnValue[0])
      await userDoc.updateOne(
        { "keystore.id_token": token },
        {
          $set: {
            "keystore.id_token": {
              id_token: returnValue[0],
              refresh_token: returnValue[1],
            },
          },
        }
      );

    return returnValue;
  },
};
