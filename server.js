require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const verifyAuthHeader = require("./middlewares/verifyAuthHeader");
const verifyAuthParam = require("./middlewares/verifyAuthParam");

const app = express();
app.use(cors());
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));

// Connecting DB **********
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("MongoDB connected...");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDB();

// API Routes Middlwares **********
// Authentication Routes
app.use("/api/auth", require("./api/auth"));

// User Panel Routes
app.use("/api/users", verifyAuthHeader, require("./api/users"));
app.use("/api/stories", verifyAuthHeader, require("./api/stories"));
app.use(
  "/api/tinymce-upload-image",
  verifyAuthParam,
  require("./api/tinymce-upload-image")
);

// User Panel Assets Serving Routes
app.use("/api/tinymce", express.static("assets/tinymce"));
app.use("/api/assets/images", verifyAuthParam, express.static("assets/images"));

// Serving React App
// app.use(express.static("client/build"));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
// });

// Listen on port **********
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
