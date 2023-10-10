
const uploadCapturedDataModel = require('../models/uploadCapturedDataModel');
const QRCode = require('qrcode');
const { encrypt } = require('../utile/cryptoModule');



module.exports = function(io)
{
      return {
            uploadData: function(req, res) {
                  var filePath = req.file.path;
                  uploadCapturedDataModel.saveData(filePath, function(err, result) 
                  {
                        if (err) return res.status(500).send(err);

                        //GET FILE PATH AND ENCRYPT IT AND BUILD URL
                        let path = filePath.replace(/\\/g, '/');
                        let encryptedPath = encrypt(path);
                        let encryptedPathStr = Buffer.from(JSON.stringify(encryptedPath)).toString('base64');
                        var fileUrl = 'https://testappgem-production.up.railway.app/download?path=' + encodeURIComponent(encryptedPathStr);
                        //  https://www.google.com/
                        //  var fileUrl = 'https://www.testappgem-production.up.railway.app/' + path;

                        //GENERATE QR CODE AND SEND IT TO CLIENT
                        QRCode.toDataURL(fileUrl, function (err, url)
                        {
                              if (err) {
                                    res.status(200).send({ message: 'File saved successfully', filePath: filePath, fileUrl: fileUrl, qrcode: `error` });
                                    console.error('Error generating QR code', err);
                                    return;
                              }

                              // Emit a message to all connected clients
                              io.emit('fileSaved', { filePath: filePath, fileUrl: fileUrl, qrcode: url });

                              res.status(200).send({ message: 'File saved successfully', filePath: filePath, fileUrl: fileUrl, qrcode: url});
                        });
                  });
            }
      };
};
