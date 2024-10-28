const mongoose = require("mongoose");
const joi = require("joi");




const OrderDetailsSchema = new mongoose.Schema({
    OrderNo:{
        type:mongoose.Types.ObjectId,
        ref:"Order",
        required:true
    },
    Product:{
        type:mongoose.Types.ObjectId,
        ref:"Product",
        required:true 
    },
    TotalOrder:{
        type:Number,
        
    },
    Email:{
        type:String,
        require:true
    },
    mobilenumber:{
        type:String,
        require:true
    },
    paymentmethod:{
        type:String,
        require:true
    },
    createdAt: {
        type: Date,
        default: Date.now(), 
    },
    status:{
        type:String,
        enum:["paid","unpaid"],
        default:"unpaid"
    },
  
}, {timestamps:true})

const OrderDetails = mongoose.model("OrderDetails" , OrderDetailsSchema)


module.exports = {
    OrderDetails
}