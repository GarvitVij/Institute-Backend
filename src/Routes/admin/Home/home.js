const express = require('express')
const adminAuth = require('../../../middlewares/adminAuth')
const router = new express.Router()
const Student = require('../../../Models/Student')
const Setting = require('../../../Models/Settings')
const Receipt = require('../../../Models/Payment')
const moment = require('moment')

router.get('/',async(req,res)=>{
    try{
        const odd = [1,3,5,7,9]
        const even = [2,4,6,8,10]
        isSem =  moment().month() + 1 < 7 ? even : odd  

        //Chart One
        const paid = await Student.find({ currentSemester: { $in: odd }}).countDocuments({hasPaid: true})
        let notPaid = await Student.find({hasPaid: false, currentSemester: { $in: odd }}).select(['rollNumber'])
        notPaid = notPaid.map(notPaidRollNumber => { return notPaidRollNumber['rollNumber']})
        const loggedIn = await Receipt.countDocuments({rollNumber: {$in: notPaid}})
        const total = paid + notPaid.length
        const notLoggedIn = total - (loggedIn + paid)
        const chartOne = {paid: paid, notLoggedIn:notLoggedIn, loggedIn: loggedIn, total: total }

        //Chart Two
        let computerRollNumber = await Student.find({currentSemester: {$in: odd}, branch: 'Computer Engineering'}).select(['rollNumber'])
        computerRollNumber = computerRollNumber.map(obj => obj['rollNumber'])
        let computerPaid = await Receipt.find({rollNumber: {$in: computerRollNumber}, isSuccess: true}).select(['amount'])
        computerPaidAmount = 0
        computerPaid.map(paid => {computerPaidAmount = computerPaidAmount + (paid.amount / 100)})

        let autoRollNumber = await Student.find({currentSemester: {$in: odd}, branch: 'Automobile Engineering'}).select(['rollNumber'])
        autoRollNumber = autoRollNumber.map(obj => obj['rollNumber'])
        let autoPaid = await Receipt.find({rollNumber: {$in: autoRollNumber}, isSuccess: true}).select(['amount'])
        autoPaidAmount = 0
        autoPaid.map(paid => {autoPaidAmount = autoPaidAmount + (paid.amount / 100)})

        let eceRollNumber = await Student.find({currentSemester: {$in: odd}, branch: 'Electronics and Communication Engineering'}).select(['rollNumber'])
        eceRollNumber = eceRollNumber.map(obj => obj['rollNumber'])
        let ecePaid = await Receipt.find({rollNumber: {$in: eceRollNumber}, isSuccess: true}).select(['amount'])
        ecePaidAmount = 0
        ecePaid.map(paid => {ecePaidAmount = ecePaidAmount + (paid.amount / 100)})

        const chartTwo = {computerPaidAmount, autoPaidAmount, ecePaidAmount}

        res.send({chartTwo})

        //Chart Three 

         


        //Data 


        //Notices


    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: 'Something went wrong !'})
    }
})



module.exports = router 