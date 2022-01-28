const path = require('path');
const { StatusCodes } = require('http-status-codes');

// para subir al server ( a mi carpeta public/uploads )
const uploadProductImage = async (req, res) => {
   // console.log(req.files); 🐸
   let productImage = req.files.image;

   const imagePath = path.join(
      __dirname,
      '../public/uploads/' + `${productImage.name}`
   );

   await productImage.mv(imagePath); // 🐥

   return res
      .status(StatusCodes.OK)
      .json({ image: { src: `/uploads/${productImage.name}` } });
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
