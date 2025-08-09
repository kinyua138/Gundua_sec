const mongoose = require("mongoose");

const sclassSchema = new mongoose.Schema({
    sclassName: {
        type: String,
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    feeDetails: [
        {
            description: { type: String, required: true },
            amount: { type: Number, required: true },
        }
    ],
    totalFee: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model("sclass", sclassSchema);

