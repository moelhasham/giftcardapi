const mongoose = require("mongoose");
const joi = require("joi");

const ProductesSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        trim:true
    },
    cardinfo:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"GiftCard"
    },
    valueCatecory:{
        type:Number,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true,
        maxlength:200,
        minlength:3
    },
    image:{
        type:Object,
        default:{
            url:"",
        }
    },
    category:{
        type:mongoose.Types.ObjectId,
        ref:"Category",
        required:true
    },
}, {timestamps:true})

const Product = mongoose.model("Product" , ProductesSchema)

function validateproduct(obj){
    const Schema = joi.object({
        name: joi.string().required().min(3).max(50),
        price: joi.number().required(),
        cardinfo: joi.string().required(),
        valueCatecory: joi.number().required(),
        description: joi.string().required().min(3).max(200),
        category:joi.string().required(),
       
    })

    return Schema.validate(obj)
}

module.exports = {
    Product,
    validateproduct
}