const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
    statusCode: {
        type: Number,
        required: true,
        max:3,
        min:3
    },
    by:{
        type: String,
        required: true,
        max:255,
        trim:true
    },
    desc:{
        type:String,
        required: true,
        max: 400,
        trim:true
    }
}, {timestamps: true})


const Logs = mongoose.model('Logs', logSchema)

module.exports = Log