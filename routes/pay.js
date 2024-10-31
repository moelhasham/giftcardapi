const express = require("express");
const { sendOtp, comfirm, sendOtpSadad, comfirmSadad, confirmCard, getSecureHash } = require("../controllers/pay");
const { sendgiftcard } = require("../controllers/productes");
const router = express.Router()

router.post("/send-otp",sendOtp)
router.post("/confirm",comfirm,sendgiftcard)
router.post("/send-otp-sadad",sendOtpSadad)
router.post("/confirm-sadad",comfirmSadad,sendgiftcard)
router.post("/payment/generate-hash",getSecureHash) 
router.post("/confirm-card",confirmCard,sendgiftcard) 





module.exports = router