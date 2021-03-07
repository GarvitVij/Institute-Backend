const mongoose = require('mongoose')


const updateReceiptSchema = new mongoose.Schema({
    receiptID:{
        type: String,
        required: true,
        trim:true
    },
    rollNumber:{
        type:String,
        required:true
    },
    branch:{
        type: String,
        required: true,
        enum: ['Computer Engineering', 'Automobile engineering', 'Electronics and Communication Engineering']
    },
    semester: {
        type: Number,
        required: true,
        enum: [1,2,3,4,5,6,7,8,9,10],
        maxlength:2
    },
    from:{
        type:String,
        required:true,
        trim:true,
        max:255
    },
    to:{
        type:String,
        required:true,
        trim:true,
        max:255
    },
    isValid: {
        type:Boolean,
        required: true,
        default: false
    }
}, {timestamps: true})

const updateReceipt = mongoose.model('Update', updateReceiptSchema)

module.exports = updateReceipt