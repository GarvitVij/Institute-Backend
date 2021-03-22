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
const Subject = require('../../../Models/Subject')
const Student = require('../../../Models/Student')
const ejs = require("ejs");
const pdf = require("html-pdf");
const fs = require('fs')
const path = require("path");

router.get('/getAll', studentAuth, async(req,res)=>{
    try{
        const receipts = await Receipt.find({rollNumber: req.student.rollNumber, isSuccess: true, isPartialSuccess: true})
        const odd = [1,3,5]
        const even = [2,4,6]
        const evenOdd = (req.student.currentSemester)%2 
        let validSems = evenOdd === 1 ? odd : even
        validSems=validSems.filter(sem=> sem < req.student.currentSemester)
        const subjects = await Subject.find({branch: req.student.branch, semester:{$in: validSems}})
        if(!receipts && !subjects){
            return res.status(404).send()
        }
        return res.send({receipts, subjects})
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
                    if(req.body.semester ){
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
                        semester: req.body.semester,
                        notes: notes,
                        amount: amount*100
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
            if(req.body.order_id && req.body.success.razorpay_signature){
                const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
                shasum.update(`${req.body.order_id}|${req.body.success.razorpay_payment_id}`);
                const digest = shasum.digest("hex");
                if (digest === req.body.success.razorpay_signature){
                    receipt.isPartialSuccess = true
                }
                updatedReceipt = await receipt.save()
            }
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


router.get('/generate', studentAuth, processValue(['receiptID']), async(req,res)=>{
    try{
        let students = [
            {name: "Joy",
             email: "joy@example.com",
             city: "New York",
             country: "USA"},
            {name: "John",
             email: "John@example.com",
             city: "San Francisco",
             country: "USA"},
            {name: "Clark",
             email: "Clark@example.com",
             city: "Seattle",
             country: "USA"},
            {name: "Watson",
             email: "Watson@example.com",
             city: "Boston",
             country: "USA"},
            {name: "Tony",
             email: "Tony@example.com",
             city: "Los Angels",
             country: "USA"
         }];
        const receipt = await Receipt.find({receiptID: req.body.receiptID})
        ejs.renderFile(path.join(__dirname, './views/', "report-template.ejs"), {students: students}, (err, data) => {
            if (err) {
                  res.send(err);
            } else {
                let options = {
                    "height": "11.25in",
                    "width": "8.5in",
                    "header": {
                        "height": "20mm"
                    },
                    "footer": {
                        "height": "20mm",
                    },
                };
                const id = nanoid()
                pdf.create(data, options).toFile(path.join(__dirname, `./${id}.pdf`), function (err, data) {
                    if (err) {
                        res.send(err);
                    } else {
                       res.download(path.join(__dirname, `${id}.pdf`), function(err) {
                        if (err) {
                          console.log(err); // Check error if you want
                        }
                        fs.unlink(path.join(__dirname, `${id}.pdf`), function(){
                            console.log("File was deleted") // Callback
                        });
                      })
                    }
                });
            }
        });
    }catch(e){
        return res.send({error: 'Try again later'})
    }
})


module.exports = router