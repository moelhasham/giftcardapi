const crypto = require('crypto');
require("dotenv").config()


// Key for encryption/decryption
const algorithm = 'aes-256-cbc';
const secretKey = Buffer.from(process.env.SECRETKEY, 'hex');
const iv = crypto.randomBytes(16);



// // Encrypt function 
function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedData: encrypted , iv: iv.toString('hex') };
}


// Decrypt function
function decrypt(encryptedText, iv) {
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}


module.exports= {
    encrypt,
    decrypt
}