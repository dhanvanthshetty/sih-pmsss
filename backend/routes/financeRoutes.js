const express = require('express');
const { financeLogin } = require('../controllers/financeController'); // Ensure path is correct

const router = express.Router();

// Route for Finance Bureau login
router.post('/finance-bureau-login', financeLogin);

module.exports = router;
