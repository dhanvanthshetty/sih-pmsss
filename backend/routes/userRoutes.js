const express = require('express');
const { rejectUser, getApprovedUsers, pushToDbt } = require('../controllers/userController');
const router = express.Router();

// POST route to reject a user
router.post('/reject/:id', rejectUser);
// Route to get all approved users
router.get('/approved', getApprovedUsers);

// Route to push a user to DBT and send email
router.post('/push-to-dbt/:id', pushToDbt);

module.exports = router;
