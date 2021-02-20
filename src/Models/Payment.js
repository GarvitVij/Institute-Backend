const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    recepitID:{
        type: String,
        required: true,
        max:255,
        trim:true
    },
    orderID:{
        type: String,
        required: true,
        max:255,
        trim:true
    },
    amount: {
        type: Number,
        required: true,
        max:4,
    },
    notes: {
        type: String,
        required: true,
        max: 1000,
        trim:true
    },
    date:{
        type: Date,
        required:true,
    },
    method: {
        type: String,
        required: true,
        max: 255,
        trim:true
    },
    description:{
        type:String,
        required: true,
        max:255,
        trim:true
    },
    isSuccess:{
        type: Boolean,
        required: true
    },
    razorpayPaymentID:{
        type: String,
        sparse: true,
        max:500,
        trim:true
    },
    razorpayOrderID:{
        type: String,
        sparse: true,
        max:500,
        trim:true
    },
    razorpaySignature:{
        type: String,
        sparse: true,
        max:500,
        trim:true
    },
    isSigned:{
        type: Boolean,
        required: true
    },
    errorCode: {
        type:Number,
        sparse:true,
        max:5
    },
    errorDescription: {
        type:String,
        sparse:true,
        max: 255,
        trim:true
    },
    errorSource:{
        type: String,
        sparse:true,
        max: 255,
        trim:true
    },
    errorReason:{
        type:String,
        sparse:true,
        max:255,
        trim:true
    }
}, {timestamps: true})

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = Payment