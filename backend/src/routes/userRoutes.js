const express = require('express');
const { getAllUsers } = require('../controllers/userController');

const router = express.Router();

router.get('/getUsers', getAllUsers);

module.exports = router;
