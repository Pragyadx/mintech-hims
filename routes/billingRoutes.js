const express = require("express");
const router = express.Router();
const { generateInvoice, getInvoicesByPatient } = require("../controllers/billingController");

// POST create/settle invoice
router.post("/invoice", generateInvoice);

// GET invoices by patient UHID
router.get("/:uhid", getInvoicesByPatient);

module.exports = router;