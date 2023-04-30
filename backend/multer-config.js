//this is for image uploads into the Images folder
const multer = require('multer');
// const fs = require('fs');
// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, 'temp/')
//   },
//   filename: (req, file, callback) =>{
//     console.log(file)
//     callback(null, file.originalname)

//     // callback(null, new Date().toISOString()+ file.originalname)
//     // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     // callback(null, file.fieldname + '-' + uniqueSuffix)
//   }
// })
const storage = multer.memoryStorage();

module.exports = multer({storage:storage})