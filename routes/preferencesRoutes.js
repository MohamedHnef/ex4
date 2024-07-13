const express = require('express');
const router = express.Router();
const preferencesController = require('../controllers/preferencesController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/save', authMiddleware, preferencesController.savePreferences);
router.get('/all', preferencesController.getPreferences);

module.exports = router;
