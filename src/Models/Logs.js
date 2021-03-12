const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
    statusCode: {
        type: Number,
        required: true,
        maxlength:3,
        minlength:3
    },
    by:{
        type: String,
        required: true,
        maxlength:255,
        trim:true
    },
    operationName: {
        type: String,
        required: true,
        maxlength: 255,
        trim: true
    },
    desc:{
        type:String,
        required: true,
        maxlength: 400,
        trim:true
    }
}, {timestamps: true})


const Logs = mongoose.model('Logs', logSchema)

module.exports = Logs