
const uploadCapturedDataModel = require('../models/uploadCapturedDataModel');
const QRCode = require('qrcode');
const { encrypt } = require('../utile/cryptoModule');



module.exports = function(io)
{
      return {
            uploadData: function(req, res) {
                  var filePath = req.file.path;

                  console.log('FILEPATH  : ', req.file, filePath)

                  uploadCapturedDataModel.saveData(filePath, function(err, result) 
                  {
                        if (err)
                        {
                              console.log('ERROR CAPTured data controller : ', err)
                              return res.status(500).send(err);
                        }

                        //GET FILE PATH AND ENCRYPT IT AND BUILD URL
                        // let path = filePath.replace(/\\/g, '/');
                        // let path = filename + '.png';

                        // console.log('PATH CONTROLLERS : ', path);



                        let encryptedPath = encrypt(filePath);
                        let encryptedPathStr = Buffer.from(JSON.stringify(encryptedPath)).toString('base64');
                        var fileUrl = 'https://geminclusion-microapp-e9da7c5a12da.herokuapp.com/download?path=' + encodeURIComponent(encryptedPathStr);
                        //  var fileUrl = 'https://www.testappgem-production.up.railway.app/' + path;

                        //GENERATE QR CODE AND SEND IT TO CLIENT
                        QRCode.toDataURL(fileUrl, function (err, url)
                        {
                              if (err) {
                                    res.status(200).send({ message: 'File saved successfully', filePath: filePath, fileUrl: fileUrl, qrcode: `error` });
                                    console.error('Error generating QR code', err);
                                    return;
                              }

                              console.log("filePath : ", filePath, "fileUrl : ", fileUrl, "QRCODE : ", url)

                              // Emit a message to all connected clients
                              io.emit('fileSaved', { filePath: filePath, fileUrl: fileUrl, qrcode: url });

                              return res.status(200).send({ message: 'File saved successfully', filePath: filePath, fileUrl: fileUrl, qrcode: url});
                        });
                  });
            }
      };
};
