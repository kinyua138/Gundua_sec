const FeeStructure = require('../models/FeeStructure');
const Student = require('../models/studentSchema');

exports.getStudentFeeBalance = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const classId = student.sclassName;
    const feeStructure = await FeeStructure.findOne({ classId });
    if (!feeStructure) {
      return res.status(404).json({ message: 'Fee structure not found for student\'s class' });
    }
    const payment = feeStructure.payments.find(p => p.studentId.toString() === studentId);
    const amountPaid = payment ? payment.amountPaid : 0;
    const balance = feeStructure.totalFee - amountPaid;
    res.json({ totalFee: feeStructure.totalFee, amountPaid, balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
