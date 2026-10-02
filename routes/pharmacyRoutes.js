const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacyController');

// Support both the root endpoint and the hospitalId route
router.get('/', pharmacyController.getInventory);
router.get('/inventory/:hospitalId', pharmacyController.getInventory);

// Inward stock addition
router.post('/', pharmacyController.addMedicine);
router.post('/add', pharmacyController.addMedicine);

// Dispense route
if (typeof pharmacyController.dispenseMedicine === 'function') {
  router.post('/dispense', pharmacyController.dispenseMedicine);
}

module.exports = router;