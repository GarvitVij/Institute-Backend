const express = require('express')
const router = new express.Router()
const keyAuth = require('../../../middlewares/keyAuth')
const processValue = require('../../../middlewares/processValue')
const Receipt = require('../../../Models/Payment')
const Razorpay = require('razorpay')

router.get('/getOrder', keyAuth, processValue(['id']), async (req, res)=>{
    
    if(!req.body.id){
        return res.send({error:"Please provide an ID"})
    }
    try{
        var instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET
          })
        const order_id = req.body.id
        const order = instance.orders.fetch(order_id)
        if(!order){
            return res.send({error: 'Cant find order matching the order id'})
        }
        return res.send({order})
    }catch(e){
        return res.send({error: 'Something went Wrong'})
    } 
})

router.get('/getPayments', keyAuth, processValue(['id']), async (req, res)=>{
    if(!req.body.id){
        return res.send({error:"Please provide an ID"})
    }
    try{
        var instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET
          })
        const order_id = req.body.id
        const order = instance.orders.fetchPayments(order_id)
        if(!order){
            return res.send({error: 'Cant find order matching the order id'})
        }
        return res.send({order})
    }catch(e){
        return res.send({error: 'Something went Wrong'})
    }

})

router.get('/getPaymentsDetails', keyAuth, processValue(['id']), async (req, res)=>{
    if(!req.body.id){
        return res.send({error:"Please provide an ID"})
    }
    try{
        var instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET
          })
        const payment_id = req.body.id
        const payment = instance.payments.fetch(payment_id)
        if(!payment){
            return res.send({error: 'Cant find order matching the order id'})
        }
        return res.send({payment})
    }catch(e){
        return res.send({error: 'Something went Wrong'})
    }

})

router.get('/orderDetails', keyAuth, processValue(['receiptID']), async(req,res)=>{
    try{
        const receipt = await Receipt.findOne({receiptID: req.body.receiptID})
        if(!receipt){
            return res.send({error: 'No receipt Found'})
        }
        return res.send({receipt})
    }catch(e){
        return res.send({error: "Some error occurred"})
    }
})

router.post('/fixSignature', keyAuth, processValue(['orderID']), async(req,res)=>{
    try{
        let receipt = await Receipt.findOne({orderID: req.body.orderID})
        if(!receipt){
            return res.send({error: 'No receipt Found'})
        }
        if(receipt.isSigned){
            return res.send({error: 'Receipt already signed'})
        }
        receipt.isSigned = true
        receipt = await receipt.save()
        return res.send({receipt})
    }catch(e){
        return res.send({error: 'Some error occurred'})
    }
})

router.post('/fixSuccess', keyAuth, processValue(['orderID', 'paymentID']), async(req,res)=>{
    try{
        let receipt = await Receipt.findOne({orderID: req.body.orderID})
        if(!receipt){
            return res.send({error: 'No receipt Found'})
        }
        if(receipt.isSuccess){
            return res.send({error: 'Receipt already a success'})
        }
        if(!req.body.paymentID){
            return res.send({error: 'Please provide a payment ID'})
        }
        receipt.isSigned = true
        receipt.isSuccess = true
        receipt.razorpayPaymentID = req.body.paymentID
        receipt = await receipt.save()
        return res.send({receipt})
    }catch(e){
        return res.send({error: 'Some error occurred'})
    }
})

module.exports = router