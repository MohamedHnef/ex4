const express = require('express');
const router = express.Router();
const preferencesController = require('../controllers/preferencesController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', preferencesController.getPreferences);
router.post('/save', authMiddleware, preferencesController.savePreferences);
router.put('/update', authMiddleware, preferencesController.updatePreferences); 
router.get('/destinations', preferencesController.getDestinations);
router.get('/vacationTypes', preferencesController.getVacationTypes);
router.delete('/delete', preferencesController.deletePreference);
module.exports = router;
