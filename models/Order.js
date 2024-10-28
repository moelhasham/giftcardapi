const mongoose = require("mongoose");


const OrderSchema = new mongoose.Schema({
      OrderNo:{
          type:String,
          required:true
      }
})

const Order = mongoose.model("Order", OrderSchema)

module.exports = {
    Order
}