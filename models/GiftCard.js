const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema({
  encryptedCode: { type: String, required: true },
  iv: { type: String, required: true }, // Store IV separately
  
}, {timestamps:true});

const GiftCard = mongoose.model('GiftCard', giftCardSchema);
module.exports = {GiftCard};