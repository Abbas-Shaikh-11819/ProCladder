const Product = require('../models/Product');
const Testimonial = require('../models/Testimonial');

const homeController = {
  // Display homepage
  getHomePage: async (req, res) => {
    try {
      // Get featured products for slider
      const featuredProducts = await Product.find({ isUpcoming: false }).limit(6);
      
      // Get upcoming products
      const upcomingProducts = await Product.find({ isUpcoming: true }).limit(3);
      
      // Get active testimonials
      const testimonials = await Testimonial.find({ isActive: true }).limit(5);

      res.render('pages/home', {
        title: 'Professional 3D Cladding Services',
        featuredProducts,
        upcomingProducts,
        testimonials,
        pageUrl: req.originalUrl
      });
    } catch (error) {
      console.error('Homepage error:', error);
      res.status(500).render('pages/error', { 
        title: 'Server Error',
        message: 'Something went wrong. Please try again later.'
      });
      console.log(error)
    }
  },

  // Display about page
  getAboutPage: async (req, res) => {
    try {
      // Get all products for the image slider
      const allProducts = await Product.find({ isUpcoming: false });

      res.render('pages/about', {
        title: 'About Us - Expert 3D Cladding Solutions',
        products: allProducts,
        pageUrl: req.originalUrl
      });
    } catch (error) {
      console.error('About page error:', error);
      res.status(500).render('pages/error', { 
        title: 'Server Error',
        message: 'Unable to load page content.'
      });
      console.log(error)
    }
  }
};

module.exports = homeController;

