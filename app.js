require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

// ===== para ver el archivo (imagen) en el req en la propiedad file y tambien poder mover el archivo
const fileUpload = require('express-fileupload');

// ===== database
const connectDB = require('./db/connect');

// ===== router
const productRouter = require('./routes/productRoutes');

// ===== error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// @@@@@@@@@@@@@@@@@@@@ MIDDLEWARE/ROUTES
app.use(express.static('./public')); // 🐱
app.use(express.json());
app.use(fileUpload()); // para ver el archivo (imagen) en el body

// ===== routes
app.get('/', (req, res) => {
   res.send('<h1>File Upload Starter</h1>');
});

app.use('/api/v1/products', productRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// @@@@@@@@@@@@@@@@@@@@ APP LISTEN
const port = process.env.PORT || 3000;

const start = async () => {
   try {
      await connectDB(process.env.MONGO_URI);

      app.listen(port, () =>
         console.log(`Server is listening on port ${port}...👍`)
      );
   } catch (error) {
      console.log(error);
   }
};

start();

//
// 🐱 para hacer publicos los archivos estaticos
// la imagen q se sube a través de página se sube 1ro al servidor, y se guardan en la carpeta "/uploads" de la carpeta "/public" y de aquí se sube a la DB ( fijarse en browser-app.js )
