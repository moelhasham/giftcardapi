const multer = require("multer")
require("dotenv").config()
const { S3Client , PutObjectCommand , DeleteObjectCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');
const path = require('path')



// S3 HANDLE 
const s3 = new S3Client({
    credentials:{
       accessKeyId: process.env.accesskey ,
       secretAccessKey: process.env.secretaccesskey ,
    },
    region:process.env.bucketregion
})

// MULTER STORAGE
const photostorage = multer.diskStorage({
   destination: function(req,file,cb){
   cb(null,path.join(__dirname, "../images")) 
   },
   filename: function(req,file,cb){
   if(file){
   cb(null,new Date().toISOString().replace(/:/g,"-") + file.originalname)
   }else{
   cb(null,false)
   }
   }
  });

//   UPLOAD FOR SERVER
  const photoupload = multer({
   storage: photostorage,

  });

// UPLOAD IMAGE FUNCTION FOR AWS
const uploadImage = async (filePath) => {
    const fileName = path.basename(filePath);
    const fileStream = fs.createReadStream(filePath);
    
    //  PARAMS 
    const uploadParams = {
      Bucket: process.env.bucketname,
      Key: fileName, // The name to save in S3
      Body: fileStream,
      ContentType:'image/jpeg', // Change based on the image type
    };
  
    try {
     await s3.send(new PutObjectCommand(uploadParams));
      console.log(`File uploaded successfully`);
      
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };

  const removeImage = async (filePath) => {
    try {
  
          const image = filePath
          // Extract the file name from the URL
          const fileNamee = image.split('/').pop(); 
  
          console.log(fileNamee)
  
            const deleteParams = {
                  Bucket:process.env.bucketname,
                  Key: fileNamee,
           };
  
          // Delete the image from S3
          await s3.send(new DeleteObjectCommand(deleteParams));
  
          //   // Remove the image record from MongoDB
          return true;
        } catch (err) {
      console.error('Error deleting file:', err);
 
     }
  };
  

module.exports = {
    uploadImage,
    photoupload,
    removeImage
}
