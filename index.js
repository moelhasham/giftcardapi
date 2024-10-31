const express = require("express");
const app = express();
const productpath =  require("./routes/productes")
const paypath =  require("./routes/pay")
const { notFound, errorHandler} = require("./middleware/error")
const axios = require("axios");
require("dotenv").config()
const cors = require("cors")
const CryptoJS = require('crypto-js');
const { conectDB } = require("./utils/db");
const { sendemail } = require("./middleware/sendemail");
const requestIp = require('request-ip');
const  rateLimit  = require("express-rate-limit")
const helmet = require("helmet")
var xss = require("xss");
app.use(express.json())

app.use(helmet());


const corsOptions = {
  origin: 'https://royalcell.online'
};
app.use(cors(corsOptions))

app.use(rateLimit({
  windowMs: 10 * 60 * 1000,
  max:100,
}))

app.use(requestIp.mw());



conectDB()

app.use("/api", productpath)
app.use("/pay", paypath)



// 404 Not Found Middleware
app.use(notFound);

// Error Handling Middleware
app.use(errorHandler);


app.listen(5005 || process.env.SERVER, (req,res) => {
 console.log("server run")
})