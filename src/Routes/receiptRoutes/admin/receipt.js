const express = require('express')
const adminAuth = require('../../../middlewares/adminAuth')
const processValue = require('../../../middlewares/processValue')
const router = new express.Router()
const Receipt = require('../../../Models/Payment')

router.get('/validate', adminAuth, processValue(['semester', 'rollNumber', 'receiptNumber' ]), async(req,res)=>{
    try{
        const receipt = await Receipt.findOne({semester: req.body.semester, rollNumber: req.body.rollNumber, receiptID: req.body.receiptNumber, isSuccess: true})
        if(!receipt){
            return res.status(406).send({errorMessage: 'cant find any receipt!'})
        }
        if(receipt.isPartialSuccess===false){
            return res.status(406).send({errorMessage: 'Payment doesnt seems legit, contact admin !'})
        }
        if(receipt.isValid === true){
            return res.status(406).send({message: 'Receipt is already validated'})
        }
        res.status(200).send({amount: receipt.amount, notes: receipt.notes, orderID: receipt.orderID, razorpayPaymentID:receipt.razorpayPaymentID  })
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: 'Something went wrong, please try again later'})
    }
})

router.post('/validate', adminAuth, processValue(['orderID', 'paymentID']), async(req,res)=>{
    try{
        const receipt = await Receipt.findOne({orderID: req.body.orderID, razorpayPaymentID: req.body.paymentID})
        if(!receipt){
            return res.status(406).send({errorMessage: 'cant find any receipt!'})
        }
        if(receipt.isPartialSuccess===false){
            return res.status(406).send({errorMessage: 'Payment doesnt seems legit, contact admin !'})
        }
        if(receipt.isValid === true){
            return res.status(200).send({success: 'Receipt is already validated'})
        }
        receipt.isValid = true
        const savedReceipt = await receipt.save()
        return res.status(200).send({savedReceipt})
    }catch(e){
        console.log(e)
        return res.status(400).send({errorMessage: 'Cant updated receipt now! something went wrong'})
    }
})

router.get('/', adminAuth, processValue(['paged', 'filters']) , async(req,res)=>{
    try{
        if(!req.body.paged){
            req.body.paged = {}
            req.body.paged.start = 0
            req.body.paged.end = 500
        }
        const receipts = await Receipt.find({...req.body.filters} ).skip(req.body.paged.start).limit(req.body.paged.end)
        res.status(200).send({receipts})
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage:'Something went wrong'})
    }
})

module.exports = router