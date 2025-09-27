const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Home page route
router.get('/', homeController.getHomePage);

// About page route
router.get('/about', homeController.getAboutPage);

// Error handling routes
router.get('/404', (req, res) => {
    res.status(404).render('pages/error', {
        title: 'Page Not Found',
        message: 'The page you are looking for could not be found.',
        statusCode: 404,
        pageUrl: req.originalUrl
    });
});

router.get('/500', (req, res) => {
    res.status(500).render('pages/error', {
        title: 'Server Error',
        message: 'Internal server error. Please try again later.',
        statusCode: 500,
        pageUrl: req.originalUrl
    });
});

// Catch all 404 errors
router.use('*', (req, res) => {
    res.status(404).render('pages/error', {
        title: 'Page Not Found',
        message: 'The page you are looking for could not be found.',
        statusCode: 404,
        pageUrl: req.originalUrl
    });
});

module.exports = router;

