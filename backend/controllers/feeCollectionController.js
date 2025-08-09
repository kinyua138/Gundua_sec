const FeeStructure = require('../models/FeeStructure');

exports.getTotalFeeCollection = async (req, res) => {
  try {
    const feeStructures = await FeeStructure.find({});
    let totalCollected = 0;
    feeStructures.forEach(fs => {
      fs.payments.forEach(payment => {
        totalCollected += payment.amountPaid;
      });
    });
    res.json({ totalCollected });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
