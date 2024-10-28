const db = require("mongoose");
require("dotenv").config()



 function conectDB(){
    try {
       db.connect(`mongodb+srv://${process.env.DBNAME}:${process.env.DBPASS}@cluster0.izo9z.mongodb.net/cakeDB`)
       console.log("db coneciton") 
    } catch (error) {
        
        console.log(error)
    }
}


module.exports = {conectDB}