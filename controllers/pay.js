const asyncHandler = require('express-async-handler')
const {Product, validateproduct} = require("../models/Productes");
const {Category} = require("../models/Category");
const {GiftCard} = require("../models/GiftCard");
const {Order} = require("../models/Order");
const {OrderDetails} = require("../models/OrderDetails");
const axios = require("axios");
const crypto = require('crypto');
const async = require('hbs/lib/async');

require("dotenv").config()




// SEND OTP EDFALE
// POST
// PUBLIC

module.exports.sendOtp = asyncHandler(async (req,res) => {
    const  headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+process.env.Authorization,
        'X-API-KEY': process.env.XAPIKEY
      }
      let amount = 0
      
      const { cartItems ,mobile_number } = req.body;

    
    try {
        for(let i = 0 ; i < cartItems.length ; i++){
            const getproduct = await Product.find({_id: cartItems[i].id})

            if (!getproduct) {
                
              
             res.status(404).json({ success: false, message: 'Product not found' });
             return
            }
             amount +=  getproduct[0].price
        
        }
    
        const url = "https://api.plutus.ly/api/v1/transaction/edfali/verify";
        
        // Await the axios call directly without .then
        const response = await axios.post(url, {
            mobile_number,
            amount:amount +"",
        }, { headers });

        const respocode = response.data.result.process_id;
         
        // Return a success response with the relevant data
        
        res.status(200).json({ success: true, respocode, amount });
        return 
    } catch (error) {
        // Return an error response
        res.status(400).json({ success: false, message: "Failed", message: error.message });
    }
})



// CONFIRM OTP EDFALE
// POST
// PUBLIC

module.exports.comfirm = asyncHandler(async (req,res,next) => {
  try {
  // CREATE NEW ORDER NUMBER
  const randomNumber = Math.floor(Math.random() * 1000000);
  const order =`RC${randomNumber.toString()}`

  // SAVE ORDER NUMBER IN DB
  const OrderNumber = new Order({
    OrderNo:order
  })
  const NewOrderNumber = await OrderNumber.save()

    // GET DATA FROM BODY
    const {process_id, code, cartItems, email} = req.body
     
    //  EDFALE HEADERS
    const  headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+process.env.Authorization,
        'X-API-KEY': process.env.XAPIKEY
      }
       
      

        let amount = 0;
        // SAVE ORDER DETAILS IN DB
        const orderPromises = cartItems.map(cartItem => {
            const orderDetails = new OrderDetails({
        
            OrderNo: NewOrderNumber._id,
            Product:cartItem.id,
            TotalOrder: 0,
            Email:email,
            mobilenumber:"0918980076" ,
            paymentmethod:"ادفعلي",
            
          });
          
           return orderDetails.save();
          });
          const newOrders = await Promise.all(orderPromises)
         
        // GET TOTAL PRICE
        for(let i = 0 ; i < cartItems.length ; i++){
           const getproduct = await Product.find({_id: cartItems[i].id})
           amount +=   getproduct[0].price
        }
        
        // SEND REQUEST TO PAYMENT SERVER TO CONFIRMED
        const url = "https://api.plutus.ly/api/v1/transaction/edfali/confirm"; 
        const response = await axios.post(url,{
              process_id,
              code,
              amount:amount+"",
              invoice_no:order
        },{headers})
        req.message = {seccuss:true , message:response.data.message}
        req.email = email
        req.cartItems = cartItems
        
        // UPDATE STATUS ORDERDETAILS AS PAID
        const updatePramas = newOrders.map(cartitem => {
        return OrderDetails.findByIdAndUpdate(
          cartitem._id, {TotalOrder:amount,status:"paid"}, {new:true}
        )
        })
       const newPromse =  await Promise.all(updatePramas)
       next()
    
      } catch (error) {
        console.log(error.message)
        res.status(400).json(error)
      }
})


// SEND OTP SADAD
// POST
// PUBLIC
module.exports.sendOtpSadad = asyncHandler(async (req,res) => {
    const  headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+process.env.Authorization,
        'X-API-KEY': process.env.XAPIKEY
      }

      let amount = 0
      
      const { cartItems,mobile_number, birth_year } = req.body;
       
      try {
        for(let i = 0 ; i < cartItems.length ; i++){
            const getproduct = await Product.find({_id:cartItems[i].id})

            if(!getproduct) {
                
              
        res.status(404).json({ success: false, message: 'Product not found' });
        return
            }
             amount +=  getproduct[0].price
        
        }
        
        

        const url ="https://api.plutus.ly/api/v1/transaction/sadadapi/verify";
        
        // Await the axios call directly without .then
        const response = await axios.post(url, {
            mobile_number,
            birth_year,
            amount:amount + "",
        }, { headers });

        const respocode = response.data.result.process_id;
         console.log(respocode)
        // Return a success response with the relevant data
        
        res.status(200).json({ success: true, respocode, amount });
         
    } catch (error) {
       
        // Return an error response
        res.status(400).json({ success: false, message: "Failed", message: error.message });
    }

})


module.exports.comfirmSadad = asyncHandler(async (req,res,next) => {
  try {
  const randomNumber = Math.floor(Math.random() * 1000000);
  const order =`RC${randomNumber.toString()}`

  const OrderNumber = new Order({
    OrderNo:order
  })
    const NewOrderNumber = await OrderNumber.save()

    const {process_id,code,cartItems,email} = req.body
    const  headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+process.env.Authorization,
        'X-API-KEY': process.env.XAPIKEY
      }
       
      
        let amount = 0
        
          // SAVE ORDER DETAILS IN DB
          const orderPromises = cartItems.map(cartItem => {
            const orderDetails = new OrderDetails({
              OrderNo: NewOrderNumber._id,
              Product:cartItem.id,
              TotalOrder: 0,
              Email:email,
              mobilenumber:"0918980076" ,
              paymentmethod:"ادفعلي",
            
          });
          
           return orderDetails.save();
          });
          const newOrders = await Promise.all(orderPromises)

        // GET TOTAL PRICE
        for(let i = 0 ; i < cartItems.length ; i++){

            const getproduct = await Product.find({_id: cartItems[i].id})
            console.log(getproduct)
            amount += getproduct[0].price
        }
        
         // SEND REQUEST TO PAYMENT SERVER TO CONFIRMED
        const url ="https://api.plutus.ly/api/v1/transaction/sadadapi/confirm";
        const response = await axios.post(url,{
              process_id,
              code,
              amount:amount + "",
              invoice_no:order
        },{headers})

        req.message = {seccuss:true , message:response.data.message}
        req.email = email
        req.cartItems = cartItems

          // UPDATE STATUS ORDERDETAILS AS PAID
          const updatePramas = newOrders.map(cartitem => {
            return OrderDetails.findByIdAndUpdate(
             cartitem._id, {TotalOrder:amount,status:"paid"}, {new:true}
            )})
          const newPromse =  await Promise.all(updatePramas)
  
        next()

      } catch (error) {
        res.status(400).json({ success: false, message: "Failed", message: error.message });
      }
})


function createSecureHash(data, key) {
  return crypto.createHmac("sha256", Buffer.from(key, "hex"))
      .update(data)
      .digest("hex")
      .toUpperCase();
}

module.exports.getSecureHash = asyncHandler( async (req,res) => {
  const {merchantReference, cartItems } = req.body;

  if (!merchantReference) {
      return res.status(400).json({ error: "Amount and merchantReference are required." });
  }

 const MID="10081014649"
 const TID="99179395"
 const key="39636630633731362D663963322D346362642D386531662D633963303432353936373431"

  let amount = 0
  for(let i = 0 ; i < cartItems.length ; i++){
      const getproduct = await Product.find({_id: cartItems[i].id})
      
       amount +=   getproduct[0].price
  }
  amount = (amount * 1000).toString()
  //  console.log(cartItems)
  //  console.log(merchantReference)
  const dateTimeLocalTrxn = Math.floor(Date.now() / 1000).toString();
  const encodeData = `Amount=${amount}&DateTimeLocalTrxn=${dateTimeLocalTrxn}&MerchantId=${MID}&MerchantReference=${merchantReference}&TerminalId=${TID}`;
  const secureHash = createSecureHash(encodeData, key);
  console.log(secureHash)
  res.json({
      MID,
      TID,
      amount,
      dateTimeLocalTrxn,
      secureHash,
      merchantReference,
  });
})


module.exports.confirmCard = asyncHandler(async (req,res,next) => {
  try {
    const { cartItems , email } = req.body

      const randomNumber = Math.floor(Math.random() * 1000000);
      const order =`RC${randomNumber.toString()}`
   
      const OrderNumber = new Order({
          OrderNo:order
     })
      const NewOrderNumber = await OrderNumber.save()

      let amount = 0

       // SAVE ORDER DETAILS IN DB
       const orderPromises = cartItems.map(cartItem => {
         const orderDetails = new OrderDetails({
            OrderNo: NewOrderNumber._id,
            Product:cartItem.id,
            TotalOrder: 0,
            Email:email,
            mobilenumber:"09********" ,
            paymentmethod:"بطاقة مصرفية",
    
      });
  
       return orderDetails.save();
      });

       const newOrders = await Promise.all(orderPromises)

      // GET TOTAL ORDER 
      for(let i = 0 ; i < cartItems.length ; i++){
         const getproduct = await Product.find({_id: cartItems[i].id})
          amount +=   getproduct[0].price
     
     }
       const updatePramas = newOrders.map(cartitem => {
        return OrderDetails.findByIdAndUpdate(
         cartitem._id, {TotalOrder:amount,status:"paid"}, {new:true}
        )})
        const newPromse =  await Promise.all(updatePramas)

        req.email = email
        req.cartItems = cartItems
       next()
        
       } catch (error) {
        
        res.status(400).json({message:"ypur order faild"})
       }
})







