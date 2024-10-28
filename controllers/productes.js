const asyncHandler = require('express-async-handler')
const {Product, validateproduct} = require("../models/Productes");
const {Category} = require("../models/Category");
const {GiftCard} = require("../models/GiftCard");
const {uploadImage, removeImage} = require("../middleware/uploadimages")
const {encrypt,decrypt } = require("../middleware/encrypt")
const {sendemail} = require("../middleware/sendemail")

const path = require('path');
const { url } = require('inspector');
const { REFUSED } = require('dns');
const fs = require('fs');
const { emit } = require('process');



// GET ALL PRODUCTES
// PUBLIC 
// GET
module.exports.getallprductes = asyncHandler(async (req,res) => {

    const allProducts = await Product.find().select("_id name price image").populate("category" , "name  -_id")
    if(!allProducts){
        return res.status(400).json("There is not product")
    }
    res.status(200).json(allProducts)
})

// GET PRODUCTES BY ID 
// PUBLIC 
// GET
module.exports.getproductesbyId = asyncHandler(async (req,res) => {

    // GET ID 
    const Id = req.params.id
    //  CHECK PRODUCT
    const ProductesById = await Product.findById(Id).select("name price").populate("category" , "name  -_id")
    // FIND ID OR NOT FIND
    if(!ProductesById) return res.status(400).json("this is Product not found")
    // RESPONCE STATUS
    res.status(200).json(ProductesById)
});

// GET PRODUCTES BY CATEGORY 
// PUBLIC 
// GET
module.exports.getproductesbycategory = asyncHandler(async (req,res) => {
    //GET PRODUCT CATEGORY NAME
    const categoryname = req.body.name  
    // SEARCH CATEGORY NAME IN DB
    const category = await Category.findOne({name: categoryname})
    // CHECK IF CATEGORY NAME FIND
    if(!category) return res.status(400).json("category not found")
    // GET PRODUCTS BY CATEGORY ID
    const product = await Product.find({category: category.id}).select("name price").populate("category" , "name  -_id")
    res.status(200).json(product)
})

// ADD PRODUCTES 
// PRIVET
// PSOT
module.exports.addproductes = asyncHandler(async (req,res) => {
    
    // VALIDTION DATA
    const {error} = validateproduct(req.body)
    if(error){
        return res.status(404).json({message: error.message})
    }

    // GET FILE PATH 
    const filep = path.join(__dirname, `../images/${req.file.filename}`);

    // GET FILE BASE TO PUT IT ON USL AWS SAVE
    const fileName = path.basename(filep);

    // UPLOAD IMAGE TO AWS
    await uploadImage(filep)
   
    // GET ALL PRODUCT INFO FROM BODY
    const {name , price , description ,
          category , valueCatecory ,
           cardinfo} = req.body

    // ENCRYPET GIFTCARD 
    const encrypted = encrypt(cardinfo)
  
    const giftcard = GiftCard({
        encryptedCode: encrypted.encryptedData,
        iv:encrypted.iv
    })

      await giftcard.save()

    // CATEGORY CHECK IN DB
    const ccategory = await Category.findOne({name : category})
    if(!ccategory) return res.status(400).json("please add valid cateqory")

     try {
        const newProduct = new Product({
            name:name,
            price:price,
            cardinfo:giftcard.id,
            valueCatecory:valueCatecory,
            description:description,
            image:{
                url:`https://${process.env.bucketname}.s3.amazonaws.com/${fileName}`, 
            },
            category:ccategory.id,
            
        })
        
        // SAVE PRODUCT IN DB
        const savedProduct = await newProduct.save()

        // DELETE FILE FROM SERVER
         fs.unlinkSync(filep)

        // RESPONSE STATUS AND NEW PRODUCT
        res.status(200).json({message: "The Product has Created" , newPro:savedProduct})
        
     } catch (error) {
        res.json("not careted")
        console.log(error)
     }
   
})

// DELETE PRODUCTES 
// PRIVET
// DELETE
module.exports.deletedproductes = asyncHandler(async (req,res) => {
    const id = req.params.id
    const product = await Product.findByIdAndDelete(id)
    if(!product) return res.status(400).json("invalid id")
        console.log(product.image.url)
    const result = await removeImage(product.image.url)
    if(result == true){
        console.log(result)
        res.status(200).json("producte has deleted")
    }else{
        res.status(400).json("wrong")
    }

})


// UPDATE PRODUCTES 
// PRIVET
// UPDATE
module.exports.updateproduct = asyncHandler(async (req,res) => {
    const {id} = req.params

    const product = await Product.findByIdAndUpdate(id, {
        $set: {

            price: req.body.price
        }
    }, {new:true}) 

    res.status(200).json(product)
})


// SEND GIFT CARD  
// PUBLIC
// POST
module.exports.sendgiftcard = asyncHandler(async (req,res) => {
   
    const email = req.email
    const cartItems = req.cartItems
    
        if(!email){
            console.log("hello")
            return 
        }

        try {

        for(i = 0 ; i < cartItems.length ; i++){
         const getproduct = await Product.find({_id: cartItems[i].id })
         const giftcard = getproduct[0].cardinfo
         const getgiftCard = await GiftCard.find({_id:giftcard})
         const encryptedText = getgiftCard[0].encryptedCode
         const iv = getgiftCard[0].iv
         const finalcode = decrypt(encryptedText,iv)
     
          const reponse = await sendemail(finalcode,email,getproduct[0].valueCatecory)

            // DELETE PRODUCTS
            const deletepromse = cartItems.map(cartitem => {
                return Product.findByIdAndDelete(
                 cartitem.id
                )})
              const newPromse =  await Promise.all(deletepromse)
           if(reponse){
            console.log({message:"order has been complited"})
            res.status(200).json({message:"order has been complited"})
          }else{
            console.log({message:"order not order"})
            res.status(200).json({message:"order not order"})
          }
     }
    } catch (error) {
        res.status(400).json("Order is not complited ")
    }

})



