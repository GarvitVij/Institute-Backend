const jwt = require('jsonwebtoken')
const {decrypt} = require('../utils/textEncryption/textEncrypt')
const Student = require('../Models/Student')

const studentAuth = async (req,res,next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        if(!token){
            return res.status(401).send({error: 'Please Authenticate'})
        }
        const decodedToken = decrypt(token)
        const decoded = jwt.verify(decodedToken, process.env.JWT_TOKEN)
        const student = await Student.findOne({_id: decoded._id, 'tokens.token':decodedToken})
        if(!student){
            throw new Error()
        }
        req.token = token
        req.student = student
        next()
    }catch(e){
        res.clearCookie('token').status(401).send({ error: 'Please Authenticate' })
    }
   
}

module.exports = studentAuth
