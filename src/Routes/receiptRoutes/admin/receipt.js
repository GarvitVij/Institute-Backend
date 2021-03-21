const express = require('express')
const processValue = require('../../../middlewares/processValue')
const router = new express.Router()
const Receipt = require('../../../Models/Payment')

router.get('/validate', processValue(['semester', 'rollNumber', 'receiptNumber' ]), async(req,res)=>{
    try{
        const receipt = await Receipt.findOne({semester: req.body.semester, rollNumber: req.body.rollNumber, receiptID: req.body.receiptNumber, isSuccess: true})
        if(!receipt){
            return res.send({error: 'cant find any receipt!'})
        }
        if(receipt.isPartialSuccess===false){
            return res.send({error: 'Payment doesnt seems legit, contact admin !'})
        }
        if(receipt.isValid === true){
            return res.send({success: 'Receipt is already validated'})
        }
        res.send({amount: receipt.amount, notes: receipt.notes, orderID: receipt.orderID, razorpayPaymentID:receipt.razorpayPaymentID  })
    }catch(e){
        res.send({error: 'Something went wrong, please try again later'})
    }
})

router.post('/validate', processValue(['orderID', 'paymentID']), async(req,res)=>{
    try{
        const receipt = await Receipt.findOne({orderID: req.body.orderID, razorpayPaymentID: req.body.paymentID})
        if(!receipt){
            return res.send({error: 'cant find any receipt!'})
        }
        if(receipt.isPartialSuccess===false){
            return res.send({error: 'Payment doesnt seems legit, contact admin !'})
        }
        if(receipt.isValid === true){
            return res.send({success: 'Receipt is already validated'})
        }
        receipt.isValid = true
        const savedReceipt = await receipt.save()
        return res.send({savedReceipt})
    }catch(e){
        console.log(e)
        return res.send({error: 'Cant updated receipt now! something went wrong'})
    }
})

router.get('/', processValue(['paged', 'filters']) , async(req,res)=>{
    try{
        if(!req.body.paged){
            req.body.paged = {}
            req.body.paged.start = 0
            req.body.paged.end = 500
        }
        const receipts = await Receipt.find({...req.body.filters} ).skip(req.body.paged.start).limit(req.body.paged.end)
        res.send({receipts})
    }catch(e){
        res.send({error:'Something went wrong'})
    }
})

module.exports = router