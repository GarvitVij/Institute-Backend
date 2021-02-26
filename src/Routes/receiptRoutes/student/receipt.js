const express = require('express')
const processValue = require('../../../middlewares/processValue')
const studentAuth = require('../../../middlewares/studentAuth')
const router = new express.Router()
const Razorpay = require('razorpay')
const Settings = require('../../../Models/Settings')
const validatePaymentObject = require('../../../utils/validatePaymentObject/validatePaymentObject')
const {nanoid} = require('nanoid')
const Receipt = require('../../../Models/Payment')
var crypto = require('crypto');


router.get('/getAll', studentAuth, async(req,res)=>{
    try{
        const receipts = await Receipt.find({rollNumber: req.student.rollNumber, isSuccess: true})
        return res.send({receipts})
    }catch(e){
        return res.send({error: 'Try again later'})
    }
})

router.get('/getCurrent', studentAuth, async(req,res)=>{
    try{
        const receipt = await Receipt.find({rollNumber: req.student.rollNumber, semester: req.student.currentSemester, isSuccess: true})
        return res.send({receipt})
    }catch(e){
        return res.send({error: 'Try again later'})
    }
})

router.post('/pay', 
            studentAuth, 
            processValue(['subjects','semester']), 
            validatePaymentObject,
            async(req,res)=>{
                try{
                    const settings = await Settings.findOne()
                    if(!settings){
                        return res.status(500).send({error: 'Cant process request now'})
                    }
                    let amount = 0
                    let notes = []
                    if(req.body.semester){
                        amount = amount + settings.normalFee
                        notes.push(`for Semester : ${req.body.semester}`)
                    }
                    if(req.body.subjects){
                        req.body.subjects.forEach(semSubject => {
                            let payableAmoutForEachsemSubject = semSubject.subjects.length > 3 ? settings.maxPerSemesterFee : (semSubject.subjects.length * settings.backExamFee)
                            notes.push(`for back semester : ${semSubject.semester} and subjects : ${semSubject.subjects.toString()}`)
                            amount = amount + payableAmoutForEachsemSubject
                        } )
                    }    
                    const now = Date.now()
                    const lateFeeCheck = now >= settings.maxLateFeeDate ? settings.maxLateFee : now >= settings.minLateFeeDate ? settings.minLateFee : 0
                    amount =  amount + lateFeeCheck

                    const receiptExsist = await Receipt.findOne({
                        rollNumber: req.student.rollNumber,
                        semester: req.student.currentSemester,
                        notes: notes,
                        amount: amount
                    })

                    if(receiptExsist){
                        return res.send({savedReceipt: receiptExsist, student: req.student})
                    }

                    const razorpayInstance = new Razorpay({
                        key_id: process.env.RAZORPAY_KEY_ID,
                        key_secret: process.env.RAZORPAY_SECRET,
                    })

                    const options = {
                        amount: amount * 100,
                        currency: "INR",
                        notes: notes,
                        receipt: `receipt_${nanoid()}`
                    }

                    const order = await razorpayInstance.orders.create(options)

                    if(!order){
                        return res.send({error: 'Some error occured'})
                    }

                    const receipt = new Receipt({
                        rollNumber: req.student.rollNumber,
                        semester: req.student.currentSemester,
                        receiptID: options.receipt,
                        orderID: order.id,
                        amount: order.amount,
                        notes: order.notes,
                        date: (order.created_at * 1000)
                    })
                    const savedReceipt = await receipt.save()
                    res.send({savedReceipt, student: req.student})
    }catch(e){
        console.log(e)
        return res.send({error: 'Please try again later'})
    }
})

router.post('/validate', studentAuth,processValue(['success', 'error', 'order_id']) ,async(req,res)=>{
    if(!req.body.success && !req.body.error){
        return res.send({error: 'Cant process now'})
    }
    try{
        const receipt = await Receipt.findOne({rollNumber: req.student.rollNumber, orderID:req.body.order_id })
        if(!receipt){
            return res.send({error: 'something went wrong while fetching'})
        }
    
        let updatedReceipt = {}
        if(req.body.success){
            const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
            shasum.update(`${req.body.order_id}|${req.body.success.razorpay_payment_id}`);
            
            receipt.isSigned = true
            
            const digest = shasum.digest("hex");
            if (digest !== req.body.success.razorpay_signature){
                receipt.isSigned = false
            }
    
            receipt.isSuccess = true
            receipt.razorpayPaymentID = req.body.success.razorpay_payment_id
            updatedReceipt = await receipt.save()

        }else{
            receipt.paymentErrors = receipt.paymentErrors.concat({
                errorCode: req.body.error.code,
                errorDescription: req.body.error.decription,
                errorSource: req.body.error.source,
                errorReason: req.body.error.reason,
                paymentId: req.body.error.payment_id
            })
            updatedReceipt = await receipt.save()
        }
        return res.send({updatedReceipt})
    }catch(e){
        console.log(e)
        return res.send({error: 'something went wrong'})
    }
    
})


module.exports = router