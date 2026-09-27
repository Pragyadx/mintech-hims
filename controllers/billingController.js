const Billing = require("../models/Billing");
const OpdVisit = require("../models/OpdVisit");

// 1. Generate an invoice
exports.generateInvoice = async (req, res) => {
  try {
    const { uhid, hospitalId, visitId, paymentMode, items } = req.body;

    let linkedVisitId = visitId || null;
    if (!linkedVisitId && uhid) {
      const visit = await OpdVisit.findOne({ uhid, status: { $ne: "Cancelled" } }).sort({ createdAt: -1 });
      if (visit) linkedVisitId = visit._id;
    }

    const formattedItems = (items || []).map(item => ({
      description: item.description || "Medical Service",
      amount: Number(item.amount || item.cost || 0)
    }));

    const totalAmount = formattedItems.reduce((sum, item) => sum + item.amount, 0);
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    const invoice = await Billing.create({
      invoiceNumber,
      uhid: uhid || "WALK-IN",
      hospitalId: hospitalId || "HOSP01",
      visitId: linkedVisitId,
      items: formattedItems,
      totalAmount,
      paymentMode: paymentMode || "Cash",
      paymentStatus: "Paid"
    });

    res.status(201).json({
      success: true,
      message: "Invoice generated successfully",
      invoice
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Fetch invoices by UHID
exports.getInvoicesByPatient = async (req, res) => {
  try {
    const { uhid } = req.params;
    const invoices = await Billing.find({ uhid }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: invoices.length,
      invoices
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
