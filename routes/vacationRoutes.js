const express = require('express');
const router = express.Router();
const vacationController = require('../controllers/vacationController');

router.get('/calculate', vacationController.calculateVacation);

module.exports = router;
