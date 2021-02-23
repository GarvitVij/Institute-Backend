const express = require('express')
const router = new express.Router() 
const errorHandler = require('../../utils/errorHandler/errorHandler')
const studentAuth = require('../../middlewares/studentAuth')
const Subject = require('../../Models/Subject')

router.get('/', studentAuth ,async(req,res)=>{
    const odd = [1,3,5]
    const even = [2,4,6]
    try{
        const evenOdd = (req.student.currentSemester)%2 
        let validSems = evenOdd === 1 ? odd : even
        validSems=validSems.filter(sem=> sem < req.student.currentSemester)
        console.log(validSems)
        const subjects = await Subject.find({branch: req.student.branch, semester:{$in: validSems}})
        return res.status(200).send({student: req.student, subjects})
    }catch(e){
        res.send(e)
    }
})

module.exports = router