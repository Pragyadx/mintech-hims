const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacyController');

// Inward stock (add) and Inventory ledger (get)
router.get('/', pharmacyController.getInventory);
router.post('/', pharmacyController.addMedicine);

// Dispense route with fallback guard
if (typeof pharmacyController.dispenseMedicine === 'function') {
  router.post('/dispense', pharmacyController.dispenseMedicine);
}

module.exports = router;