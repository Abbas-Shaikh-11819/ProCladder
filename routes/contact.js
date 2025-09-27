const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');

// Validation middleware
const contactValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),
    
    body('phone')
        .optional()
        .trim()
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage('Please enter a valid phone number'),
    
    body('company')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Company name must not exceed 100 characters'),
    
    body('projectType')
        .notEmpty()
        .withMessage('Please select a project type')
        .isIn(['exterior-cladding', 'interior-cladding', 'commercial', 'residential', 'consultation', 'other'])
        .withMessage('Invalid project type selected'),
    
    body('message')
        .trim()
        .notEmpty()
        .withMessage('Message is required')
        .isLength({ min: 10, max: 1000 })
        .withMessage('Message must be between 10 and 1000 characters'),
    
    body('budget')
        .optional()
        .isIn(['under-50k', '50k-100k', '100k-500k', '500k+', 'not-specified'])
        .withMessage('Invalid budget range selected'),
    
    body('timeline')
        .optional()
        .isIn(['immediate', '1-3-months', '3-6-months', '6-12-months', 'flexible'])
        .withMessage('Invalid timeline selected')
];

// Get contact page
router.get('/', contactController.getContactPage);

// Submit contact form
router.post('/', contactValidation, contactController.submitContactForm);

// Contact success page
// router.get('/success', (req, res) => {
//     res.render('pages/contact-success', {
//         title: 'Thank You - We\'ll Be In Touch Soon',
//         pageUrl: req.originalUrl
//     });
// });

// Quick quote API endpoint
router.post('/api/quick-quote', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('projectType').notEmpty().withMessage('Project type is required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
], async (req, res) => {
    try {
        const { validationResult } = require('express-validator');
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        
        const Contact = require('../models/Contact');
        const quickQuote = new Contact({
            name: req.body.name,
            email: req.body.email,
            projectType: req.body.projectType,
            message: req.body.message,
            phone: req.body.phone || '',
            company: req.body.company || '',
            budget: req.body.budget || 'not-specified',
            timeline: req.body.timeline || 'flexible'
        });
        
        await quickQuote.save();
        
        // TODO: Send email notification
        
        res.json({
            success: true,
            message: 'Thank you! Your quote request has been submitted successfully.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting quote request',
            error: error.message
        });
    }
});

module.exports = router;