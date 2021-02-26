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
        max:2
    },
    backlogs:{
        type: Array
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
    isPending: {
        type:Boolean,
        required: true,
        default: false
    },
    changedOn: {
        type:Date,
        sparse: true,
    }
}, {timestamps: true})

const updateReceipt = mongoose.model('Update', updateReceiptSchema)

module.exports = updateReceipt