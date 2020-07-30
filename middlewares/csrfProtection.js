const csrf = require("csurf");

module.exports = csrf({
  cookie: { httpOnly: true, maxAge: 1296000 * 1000 },
});

// { httpOnly: true, maxAge: 3600000 }
