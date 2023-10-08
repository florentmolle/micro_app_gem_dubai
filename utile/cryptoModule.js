// cryptoModule.js
require('dotenv').config();
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const password = 'vf_gems_06'; // replace with your password
const salt = 'gems';
const keylen = 32;

// Generate a key
const key = crypto.scryptSync(password, salt, keylen);

module.exports.encrypt = function(text) {
    const iv = crypto.randomBytes(16); // generate a secure random initialization vector

    // Create a cipher object
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    // Encrypt some data
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return encrypted data and iv
    return { 
        iv: iv.toString('hex'),
        encryptedData: encrypted 
    };
}

module.exports.decrypt = function(encrypted) {
    const iv = Buffer.from(encrypted.iv, 'hex'); // convert iv to Buffer

    // Create a decipher object
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    // Decrypt the data
    let decrypted = decipher.update(encrypted.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}
