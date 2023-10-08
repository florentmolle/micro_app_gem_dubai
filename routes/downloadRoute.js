const express = require('express');
const router = express.Router();
const { decrypt } = require('../utile/cryptoModule');


router.get('/', function(req, res) 
{
      //DECRYPT FILE PATH
      console.log("hey : ", req.query.path);

      if(typeof req.query.path != "undefined")
      {
            let encryptedPath = JSON.parse(Buffer.from(decodeURIComponent(req.query.path), 'base64').toString());
            let decryptedPath = decrypt(encryptedPath);
            
            //Send it to the view
            res.render('download', { title : "", path: decryptedPath, iconDisplay : "block" });
      }
      else
      {
            res.render('download', { title : "Not available !", path : "", iconDisplay : "none"  });
      }
     
});
    
module.exports = router;