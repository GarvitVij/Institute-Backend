const express = require('express')
const router = new express.Router()
const Request = require('../../../Models/Update')
const processValue = require('../../../middlewares/processValue')
const Receipt = require('../../../Models/Payment')

router.get('/', processValue(['paged', 'filters']) , async(req,res)=>{
    try{
        if(!req.body.paged){
            req.body.paged = {}
            req.body.paged.start = 0
            req.body.paged.end = 500
        }
        const request = await Request.find({...req.body.filters} ).skip(req.body.paged.start).limit(req.body.paged.end)

        res.send({request})
    }catch(e){
        res.send({error:'Something went wrong'})
    }
})

router.post('/', processValue(['id', 'success']), async(req,res)=>{
    try{
        let request = {} 
        if(!req.body.id || !(req.body.success === true || req.body.success === false)  ){
            return res.send({error: 'Invalid body'})
        }
        if(req.body.success === true){
            request = await Request.findByIdAndUpdate(req.body.id, {isValid: true})
                if(!request){
                    return res.send({error: 'something went wrong updating request'})
                }
            let receipt = await Receipt.findOne({receiptID: request.receiptID})
                if(!receipt){
                    return res.send({error: 'something went wrong'})
                } 
            receipt.notes.map((note,index) => {
                receipt.notes[index] = note.replace(request.from, request.to)})
            const updatedReceipt = await Receipt.findOneAndUpdate({receiptID: request.receiptID}, {notes: receipt.notes})
            if(!updatedReceipt){
                return res.send({error: 'something went wrong'})
            } 
            return res.send({success: true})
        }else if(req.body.success === false){
            request = await Request.findByIdAndDelete(req.body.id)
            return res.send(request)
        }else{
            return res.send({error: 'try again later'})
        }
    }catch(e){
        return res.send({error: 'Something went wrong'})
    }
})

module.exports = router