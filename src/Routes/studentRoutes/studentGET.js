const express = require('express')
const router = new express.Router() 
const Student = require('../../Models/Student')
const errorHandler = require('../../utils/errorHandler/errorHandler')
const studentAuth = require('../../middlewares/studentAuth')

router.get('/', studentAuth ,async(req,res)=>{
    try{
    const student = await Student.findOne({rollNumber:11851024112 })
    res.send(student)
    }catch(e){
        res.send(e)
    }
})

module.exports = router