const FeeStructure = require('../models/FeeStructure');

exports.getFeeStructureByClass = async (req, res) => {
  try {
    const classId = req.params.classId;
    const feeStructure = await FeeStructure.findOne({ classId }).populate('classId').populate('payments.studentId');
    if (!feeStructure) {
      return res.status(404).json({ message: 'Fee structure not found for this class' });
    }
    res.json(feeStructure);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOrUpdateFeeStructure = async (req, res) => {
  try {
    const { classId, feeDetails, totalFee } = req.body;
    let feeStructure = await FeeStructure.findOne({ classId });
    if (feeStructure) {
      feeStructure.feeDetails = feeDetails;
      feeStructure.totalFee = totalFee;
      await feeStructure.save();
    } else {
      feeStructure = new FeeStructure({ classId, feeDetails, totalFee });
      await feeStructure.save();
    }
    res.status(201).json(feeStructure);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addPayment = async (req, res) => {
  try {
    const { classId, studentId, amountPaid } = req.body;
    const feeStructure = await FeeStructure.findOne({ classId });
    if (!feeStructure) {
      return res.status(404).json({ message: 'Fee structure not found for this class' });
    }
    feeStructure.payments.push({ studentId, amountPaid });
    await feeStructure.save();
    res.status(201).json(feeStructure);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
