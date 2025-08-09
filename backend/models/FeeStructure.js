const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sclass',
    required: true,
  },
  feeDetails: [
    {
      description: { type: String, required: true },
      amount: { type: Number, required: true },
    }
  ],
  totalFee: {
    type: Number,
    required: true,
  },
  payments: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
      },
      amountPaid: {
        type: Number,
        required: true,
      },
      paymentDate: {
        type: Date,
        default: Date.now,
      },
    }
  ],
});

const FeeStructure = mongoose.model('FeeStructure', feeStructureSchema);

module.exports = FeeStructure;
