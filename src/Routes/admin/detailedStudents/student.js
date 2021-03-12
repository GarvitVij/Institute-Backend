const express = require('express')
const processValue = require('../../../middlewares/processValue')
const mongoose = require('mongoose')
const router = new express.Router()
const Student = require('../../../Models/Student')
const errorHandler = require('../../../utils/errorHandler/errorHandler')
const Receipt = require('../../../Models/Payment')

router.get('/branches', async(req,res)=>{
    try{
        const branches = await Student.aggregate([
            {
                $group:
                    {
                        _id:0,
                        branch: {$addToSet: '$branch'},
                        currentSemester: {$addToSet: '$currentSemester'},
                        timing: {$addToSet: '$timing'},
                        batch: {$addToSet: '$batch'},
                    }
            }
        ])
        console.log(branches)
    }catch(e){
        return res.send({error: 'Something went wrong'})
    }
})

router.get('/students', processValue(['branch']), async(req,res)=>{
    try{
        const filters = req.body.branch.split(' | ')
        const studentData = await Student.find({branch: filters[0], timing: filters[1], batch: filters[2], currentSemester: filters[3] })
        const rollNumbers = studentData.map(student => student.rollNumber)
        const receiptsData = await Receipt.find({isSuccess: true, isValid: true, rollNumber: { $in: rollNumbers }})
        const joinedData = [] 
        studentData.map((student,index) => {
            let data = {...student._doc}
            
            delete data._id
            delete data.password
            delete data.tokens
            delete data.__v
            delete data.createdAt
            delete data.updatedAt
            delete data.resetPasswordToken

            const receipts = receiptsData.filter(receipt => receipt.rollNumber === student.rollNumber)
            data["receipts"] = receipts
            joinedData.push(data) 
        })
        res.send(joinedData)
    }catch(e){
        console.log(e)
        res.send(errorHandler(e))
    }
})



module.exports = router