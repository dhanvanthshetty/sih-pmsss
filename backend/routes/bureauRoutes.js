const express = require('express');
const { sageLogin } = require('../controllers/sageController'); // Ensure path is correct
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Route for Sage Bureau login
router.post('/sage-bureau-login', sageLogin);

module.exports = router;
