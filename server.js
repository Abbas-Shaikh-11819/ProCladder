// server.js - Main application entry point
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const connectDB = require('./config/database');
connectDB();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.use((req, res, next) => {
  next();
});

// Routes
app.use('/products', require('./routes/products'));
app.use('/contact', require('./routes/contact'));
app.use('/', require('./routes/index'));


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
