const mongoose = require('mongoose')
const validator = require('validator')

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'No Name was provided'],
        trim: true,
        minlenth: 4,
        maxLenth: 255,
        validate(value){
            const regexp = new RegExp(/^[a-z]([-']?[a-z]+)*|( [a-z]([-']?[a-z]+)*)+$/i)
            if (!regexp.test(value)) {
                throw new Error('Please provide name')
            }
        }
    },
    batch: {
        type: String,
        required: [true, "Please provide a batch"],
        trim: true,
        minlenth: 9,
        maxLenth: 9,
        validate(value) {
            const regexp = new RegExp(/^((20)\d{2})-((20)\d{2})$/i)
            if(regexp.test(value)){
                const years = value.split('-')
                if(parseInt(years[1])-parseInt(years[0]) !== 3){
                    throw new Error('Invalid batch years')
                }
            }else{
                throw new Error('Invalid batch years')
            }
        }
    },
    currentSemester: {
        type: Number,
        required: true,
        enum: [1,2,3,4,5,6,7,8,9,10],
        maxLenth:2
    },
    rollNumber: {
        type: Number,
        required: [true, "Please provide a roll number"],
        maxLength: 10,
        minlength: 10,
        unique: true,
        validate(value){
            if(value.lenth !== 10){
                throw new Error("Roll Number length has to be 10")
            }
        }
    },
    phoneNumber: {
        type: Number,
        required: [true, "Please provide a phone number"],
        minlength:10,
        maxLength:10,
        unique: true, //true
        validate(value){
            if(!validator.isMobilePhone(value.toString(),["en-IN"])){
                throw new Error('Please provide a valid phone number')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true, //true
        lowercase: true,
        maxLength: 255,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        maxLength: 122
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    resetPasswordToken: {
        type: String
    },
    isLateralEntry: {
        type:Boolean,
        required: true,
    },
    branch:{
        type: String,
        required: true,
        enum: ['Computer Engineering', 'Automobile Engineering', 'Electronics and Communication Engineering']
    },
    timing: {
        type: String,
        required: true,
        enum:['Morning', 'Evening']
    }
}, {timestamps: true})

const Student = mongoose.model('Student', studentSchema)

module.exports = Student