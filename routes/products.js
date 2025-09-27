const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

console.log('✅ Product router file has been loaded');

// Handles the GET request for '/products'
// router.get('/', productController.getAllProducts);
router.get('/', (req, res) => {
  console.log('➡️ Matched route: GET /');
  productController.getAllProducts(req, res);
});

// API Routes (Specific routes come next)
router.get('/api/search', productController.searchProducts);
router.get('/api/category/:category', productController.getProductsByCategory);

// Handles requests like '/products/some-id' (MUST BE LAST)
router.get('/:id', productController.getProductById);

module.exports = router;