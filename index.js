const express = require("express");
const app = express();
const productpath =  require("./routes/productes")
const paypath =  require("./routes/pay")
const { notFound, errorHandler} = require("./middleware/error")
const axios = require("axios");
require("dotenv").config()
const cors = require("cors")
const { conectDB } = require("./utils/db");
const { sendemail } = require("./middleware/sendemail");
const requestIp = require('request-ip');
const  rateLimit  = require("express-rate-limit")
const helmet = require("helmet")
var xss = require("xss");






app.use(express.json())

app.use(helmet());

app.use(cors({
  origin: ""
}))

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



app.get('/', (req, res , next) => {
  const clientIp = req.clientIp;  // Retrieved IP address
  res.send(`Your IP address is: ${clientIp}`);
  const date =  new Date()
  const valueCatecory = date.getDate()
  
  console.log(valueCatecory)
  const email = "moelhasham@outlook.com"
   const finalcode = "1"
  sendemail(finalcode,email,valueCatecory)
  next()
});
////////////////////////////////
app.listen(5000 , (req,res) => {
 console.log("server run")
})