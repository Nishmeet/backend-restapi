// routes/homeRoutes.js
const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
console.log('Setting up home routes');

// Root route
router.get('/', homeController.getWelcomeMessage);

module.exports = router;