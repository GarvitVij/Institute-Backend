const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    adminID: {
        type: String,
        max: 255,
        min: 5,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        sparse: true,
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
        maxlength: 64
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
},{timestamps: true})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin