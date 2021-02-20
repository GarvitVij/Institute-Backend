const mongoose = require('mongoose')

const settingSchema =  new mongoose.Schema({
    notices:[{
        notice:{
            title:{
                type: String,
                sparse: true,
                trim:true
            },
            desc:{
                type: String,
                sparse: true,
                trim:true
            }
        }
    }],
    normalFee:{
        type:Number,
        required: true,
        max: 4
    },
    backExamFee:{
        type:Number,
        required: true,
        max: 4
    },
    maxPerSemesterFee:{
        type:Number,
        required: true,
        max: 4
    },
    minLateFeeDate: {
        type:Date,
        required: true
    },
    maxLateFeeDate: {
        type:Date,
        required: true
    },
    minLateFee: {
        type:Number,
        required: true,
        max: 4
    },
    maxLateFee:{
        type:Number,
        required: true,
        max: 4
    }
},{timestamps: true})

const Setting = mongoose.model('Setting', settingSchema)

module.exports = Setting