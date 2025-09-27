const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');

const contactController = {
  // Display contact page
  getContactPage: (req, res) => {
    res.render('pages/contact', {
      title: 'Contact Us - Get Your Quote Today',
      pageUrl: req.originalUrl,
      errors: null,
      formData: null
    });
  },

  // Handle contact form submission
  submitContactForm: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.render('pages/contact', {
          title: 'Contact Us - Get Your Quote Today',
          pageUrl: req.originalUrl,
          errors: errors.array(),
          formData: req.body
        });
      }

      // Create new contact inquiry
      const contactInquiry = new Contact({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        company: req.body.company,
        projectType: req.body.projectType,
        message: req.body.message,
        budget: req.body.budget,
        timeline: req.body.timeline
      });

      await contactInquiry.save();

      // TODO: Send email notification to admin
      // TODO: Send confirmation email to client

      res.render('pages/contact', {
          title: 'Contact Us - Get Your Quote Today',
          pageUrl: req.originalUrl,
          errors: errors.array(),
          formData: req.body
        });

    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).render('pages/error', { 
        title: 'Server Error',
        message: 'Unable to submit your inquiry. Please try again.'
      });
      console.log(error)
    }
  }
};

module.exports = contactController;