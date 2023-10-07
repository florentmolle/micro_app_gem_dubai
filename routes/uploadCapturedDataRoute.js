const express = require('express');
const multer  = require('multer');
const path = require('path');

// Set up multer
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Destination folder
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) // Filename + extension
    }
});
let upload = multer({ storage: storage });

let router = express.Router();


module.exports = function(io) {
      const controller = require('../controllers/uploadCapturedDataController')(io);
      router.post('/capturedData', upload.single('file'), controller.uploadData);
      return router;
};