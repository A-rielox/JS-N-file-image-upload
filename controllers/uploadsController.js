const path = require('path');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const cloudinary = require('cloudinary').v2;
const fs = require('fs'); // pa eliminar el temp

// para subir al server ( a mi carpeta public/uploads )
// para "sin" cloudinary
const uploadProductImageLocal = async (req, res) => {
   console.log(req.files);
   // console.log(req.files); 🐸
   if (!req.files) {
      throw new CustomError.BadRequestError('No file uploaded');
   }

   const productImage = req.files.image;

   if (!productImage.mimetype.startsWith('image')) {
      throw new CustomError.BadRequestError('Please upload an image');
   }

   const maxSize = 4000000;
   if (productImage.size > maxSize) {
      throw new CustomError.BadRequestError(
         `Please upload an image smaller than ${maxSize} bytes`
      );
   }

   const imagePath = path.join(
      __dirname,
      '../public/uploads/' + `${productImage.name}`
   );

   await productImage.mv(imagePath); // 🐥

   return res
      .status(StatusCodes.OK)
      .json({ image: { src: `/uploads/${productImage.name}` } });
   //la respuesta es el path a la imagen en el servidor ( el atributo src ), q es el q se va a ocupar en el submit para pasar la imagen del server a la DB.
};

// todavia se va a ocupar el package "express-fileupload", para traer el archivo (parse that file) y almacenarlo en un temp-directory antes de mandarlo a cloudinary. Pa lo del temp hay q pasar las opciones en app.js en app.use(fileUpload({opciones}))
const uploadProductImage = async (req, res) => {
   // console.log(req.files.image); // aqui está la imagen, se crea altiro aqui ( en el server la carpeta temp y se pone el archivo )
   // al ocupar la opcion en app.js ( app.use(fileUpload({ useTempFiles: true })) ) el archivo ahora está en "req.files.image.tempFilePath" q es lo q paso como parametro acå abajo
   // el 1er arg es donde está la imagen en el temp "req.files..."
   // la carpeta a la q mando la imagen la tengo q crear en cloudinary
   // en cloudinary la imagen está accesible en el "secure_url"
   // red yellow BUSCAR LAS OPCIONES Q SE PUEDEN PONER PARA Q OPTIMICE LAS IMAGENES ANTES DE ALMACENARLAS yellow red
   const result = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      { use_filename: true, folder: '07-File-upload' }
   );

   // pa eliminar el archivo del temp, tiene q estar despues del await, para q se eliminen despues de q se mande la respuesta de q ya se subieron a la nube
   fs.unlinkSync(req.files.image.tempFilePath);

   return res
      .status(StatusCodes.OK)
      .json({ image: { src: result.secure_url } });
};

module.exports = { uploadProductImage };

// 🐥
// fcn q esta en el express-fileupload, para mover archivos a otro lado en el server (req.files.foo.mv) se le pasa el path de donde quiero dejar la imagen
// de su doc en npmjs.con
// When you upload a file, the file will be accessible from req.files.

// Example:

// You're uploading a file called car.jpg
// Your input's name field is foo: <input name="foo" type="file" />
// In your express server request, you can access your uploaded file from req.files.foo:

// app.post('/upload', function(req, res) {
//   console.log(req.files.foo); // the uploaded file object
// });

// 🐸
// en req.files
// {
//    image: {
//      name: 'f2.jpg',
//      data: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 60 00 60 00 00 ff db 00 43 00 0a 07 08 09 08 06 0a 09 08 09 0c 0b 0a 0c 0f 1a 11 0f 0e 0e 0f 1f 16 18 13 ... 44305 more bytes>,
//      size: 44355,
//      encoding: '7bit',
//      tempFilePath: '',
//      truncated: false,
//      mimetype: 'image/jpeg',
//      md5: 'a74cf8f0f9925d8f4704f1bb8a98da7f',
//      mv: [Function: mv]
//    }
//  }

// ANTES DE CLOUDINARY
/* 
const path = require('path');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

// para subir al server ( a mi carpeta public/uploads )
const uploadProductImage = async (req, res) => {
   console.log(req.files);
   // console.log(req.files); 🐸
   if (!req.files) {
      throw new CustomError.BadRequestError('No file uploaded');
   }

   const productImage = req.files.image;

   if (!productImage.mimetype.startsWith('image')) {
      throw new CustomError.BadRequestError('Please upload an image');
   }

   const maxSize = 4000000;
   if (productImage.size > maxSize) {
      throw new CustomError.BadRequestError(
         `Please upload an image smaller than ${maxSize} bytes`
      );
   }

   const imagePath = path.join(
      __dirname,
      '../public/uploads/' + `${productImage.name}`
   );

   await productImage.mv(imagePath); // 🐥

   return res
      .status(StatusCodes.OK)
      .json({ image: { src: `/uploads/${productImage.name}` } });
   //la respuesta es el path a la imagen en el servidor ( el atributo src ), q es el q se va a ocupar en el submit para pasar la imagen del server a la DB.
};

module.exports = { uploadProductImage };

*/
