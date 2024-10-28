const express = require("express");
const router = express.Router()
const {getallprductes,getproductesbyId,
       getproductesbycategory,addproductes,
       deletedproductes,updateproduct,
      } = require("../controllers/productes")

const {photoupload} = require("../middleware/uploadimages");
const { verifyToken } = require("../middleware/jwt");


// ADD PRODUCTS
router.post("/add/productes",verifyToken,photoupload.single("im"),addproductes)

// DELETE PRODICTS BY ID
router.delete("/productes/:id",verifyToken,deletedproductes)

// GET ALL PRODUCTS 
router.get("/productes",getallprductes)

// GET PRODUCTES BY CATEGORY
router.get("/productes/category",verifyToken,getproductesbycategory)

// GET PRODUCTS BY ID
router.get("/productes/:id",verifyToken,getproductesbyId)

router.put("/update/product/:id",verifyToken,updateproduct)








module.exports = router
