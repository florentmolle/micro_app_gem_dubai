const express = require('express');
const multer  = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: 'dkgrd9gjc',
    api_key: '163726139563361',
    api_secret: 'SITvHPSQLMecnWXSf2UWKgPqHBE'
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        format: async (req, file) => 'png', // supports promises as well
        public_id: (req, file) => file.fieldname + '-' + Date.now(),
    },
});


let upload = multer({ storage: storage });


// Set up multer
// let storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/') // Destination folder
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) // Filename + extension
//     }
// });
// let upload = multer({ storage: storage });

let router = express.Router();


module.exports = function(io) {
      const controller = require('../controllers/uploadCapturedDataController')(io);
      router.post('/capturedData', upload.single('file'), controller.uploadData);
      return router;
};