const Product = require('../models/Product');

const productController = {
  // === PAGE RENDERING METHODS ===

  getAllProducts: async (req, res) => {
    try {
      const { category, search } = req.query;
      let filter = { isUpcoming: false };

      if (category && category !== 'all') {
        filter.category = category;
      }
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [
          { title: searchRegex },
          { description: searchRegex },
          { shortDescription: searchRegex }
        ];
      }
      const products = await Product.find(filter).sort({ createdAt: -1 });
      const categories = await Product.distinct('category');

      res.render('pages/products', {
        title: 'Our 3D Cladding Services',
        products,
        categories,
        currentCategory: category || 'all',
        searchQuery: search || '',
        pageUrl: req.originalUrl
      });
    } catch (error) {
        console.log("hi")
        console.log(error)
      console.error('Products page error:', error);
      res.status(500).render('pages/error', { 
        title: 'Server Error', message: 'Unable to load products.'
      });
      console.log(error)
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).render('pages/error', {
          title: 'Product Not Found', message: 'The requested service could not be found.'
        });
      }
      const relatedProducts = await Product.find({
        category: product.category,
        _id: { $ne: req.params.id },
        isUpcoming: false
      }).limit(3);

      res.render('pages/product-detail', {
        title: product.title,
        product,
        relatedProducts,
        pageUrl: req.originalUrl
      });
    } catch (error) {
        console.log(error)
      console.error('Product detail error:', error);
      res.status(500).render('pages/error', { 
        title: 'Server Error', message: 'Unable to load product details.'
      });
      console.log(error)
    }
  },

  // === API METHODS ===

  searchProducts: async (req, res) => {
    try {
      const { q, category, limit = 10 } = req.query;
      let filter = { isUpcoming: false };
      if (category && category !== 'all') {
        filter.category = category;
      }
      if (q) {
        const searchRegex = new RegExp(q, 'i');
        filter.$or = [
            { title: searchRegex },
            { description: searchRegex },
            { shortDescription: searchRegex }
        ];
      }
      const products = await Product.find(filter)
        .limit(parseInt(limit))
        .select('title shortDescription image category _id')
        .sort({ createdAt: -1 });
      res.json({ success: true, products, total: products.length });
    } catch (error) {
        console.log(error)
      res.status(500).json({ success: false, message: 'Error searching products', error: error.message });
      console.log(error)
    }
  },

  getProductsByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      const products = await Product.find({ 
        category: category,
        isUpcoming: false 
      }).sort({ createdAt: -1 });
      res.json({ success: true, products, category, total: products.length });
    } catch (error) {
        console.log(error)
      res.status(500).json({ success: false, message: 'Error fetching products by category', error: error.message });
      
    }
  }
};

module.exports = productController;