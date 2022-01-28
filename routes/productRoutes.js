const express = require('express');
const router = express.Router();

const {
   createProduct,
   getAllProducts,
} = require('../controllers/productController');
const { uploadProductImage } = require('../controllers/uploadsController');

// '/api/v1/products'
router.route('/uploads').post(uploadProductImage);
router.route('/').post(createProduct).get(getAllProducts);

module.exports = router;
