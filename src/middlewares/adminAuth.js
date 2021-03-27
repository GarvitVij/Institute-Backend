const jwt = require('jsonwebtoken')
const {decrypt} = require('../utils/textEncryption/textEncrypt')
const Admin = require('../Models/Admin')

const adminAuth = async (req,res,next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        // const token = req.headers.cookie.replace("token=", "").replace("%3A", ":") || '' 
        if(!token){
            return res.status(401).send({error: 'Please Authenticate'})
        }
        const decodedToken = decrypt(token)
        const decoded = jwt.verify(decodedToken, process.env.JWT_TOKEN)
        const admin = await Admin.findOne({_id: decoded._id, 'tokens.token':decodedToken})
        if(!admin){
            throw new Error()
        }
        req.token = token
        req.admin = admin
        res.cookie('name', admin.name)
        next()
    }catch(e){
        res.clearCookie('name')
        res.clearCookie('token').status(401).send({ error: 'Please Authenticate' })
    }
   
}

module.exports = adminAuth
