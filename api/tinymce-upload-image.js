const express = require("express");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // callback(null, "./client/build/static/images");
    callback(null, "./assets/images");
    console.log(file);
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
    console.log(file);
  },
});

const upload = multer({ storage: storage }).single("file");

// @route  POST /api/upload_image
// @desc   Upload and Store image to FileSystem from TinyMCE Editor

router.post("/", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.end("error file uploading");
    }
    let name = req.file.originalname;
    console.log(name);
    res.status(200).json({ location: `/api/assets/images/${name}` });
  });
});

module.exports = router;
