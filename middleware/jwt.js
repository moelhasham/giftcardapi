const jwt  = require("jsonwebtoken")
require("dotenv").config()


function verifyToken(req,res,next){
    const authToken = req.headers.authorization;
    if(authToken){
     const token = authToken.split(" ")[1]
     try {
          
        const decode = jwt.verify(token , process.env.TOKEN) 
        req.user = decode
        next()
     } catch (error) {
       return res.status(401).json({message: "token invalid"})
     }
    }else{
        return res.status(401).json({message: "no token priveded"})
    }
}

module.exports = {
    verifyToken
}