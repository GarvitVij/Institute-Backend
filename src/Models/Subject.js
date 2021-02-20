const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema({
    branch:{
        type: String,
        required: true,
        enum: ['Computer Engineering', 'Automobile engineering', 'Electronics and Communication Engineering']
    },
    semester:{
        type:Number,
        required: true,
        enum: [1,2,3,4,5,6,7,8,9,10],
        maxlength:2
    },
    subjects: {
        type: Array,
        required: true,
        max: 10,
        validate(value){
            value.forEach(val => {
                if(typeof(val) !== "string"){
                    throw new Error("Please provide a string")
                }
            })
        }
    }
}, {timestamps: true})

const Subject = mongoose.model('Subject', subjectSchema)

module.exports = Subject