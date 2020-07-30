require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cookieEncrypter = require("cookie-encrypter");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const DB = require("./db/db");
const verifyUser = require("./middlewares/verifyUser");
const csrfProtection = require("./middlewares/csrfProtection");

const app = express();

// Default DB Connection ******
DB.defaultConn();

// Global Middlewares *********
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(cookieEncrypter(process.env.COOKIE_SECRET));
app.use(
  session({
    secret: process.env.SESS_SECRET,
    cookie: { maxAge: 1296000 * 1000 },
    name: "sid",
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({ mongooseConnection: DB.sessionStoreConn() }),
  })
);

// API Routes Middlwares ******
// Authentication Routes
app.use("/api/auth", require("./api/auth"));

// Admin Panel Routes
app.use("/api/users", verifyUser, require("./api/users"));
app.use("/api/stories", verifyUser, csrfProtection, require("./api/stories"));
app.use(
  "/api/tinymce-upload-image",
  verifyUser,
  require("./api/tinymce-upload-image")
);

// Admin Panel Assets Serving Routes
app.use("/api/tinymce", verifyUser, express.static("assets/tinymce"));
app.use("/api/assets/images", verifyUser, express.static("assets/images"));

// Serving React App
// app.use(express.static("client/build"));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
// });

// Listen on port *************
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`SERVER LISTENING ON http://localhost:${PORT}`)
);
