const express = require('express')
const adminAuth = require('../../../middlewares/adminAuth')
const router = new express.Router()
const Student = require('../../../Models/Student')

router.get('/',adminAuth, async(req,res)=>{
    
})



module.exports = router 