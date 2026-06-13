const express = require('express');
const protect = require('../middleware/authMiddleware')
const { getAllUsers } = require('../controllers/userController');

const router = express.Router();

router.get('/getUsers', protect, getAllUsers)

module.exports = router;
