const express = require('express')
const router = new express.Router()
const keyAuth = require('../../../middlewares/keyAuth')
const processValue = require('../../../middlewares/processValue')


router.get('/getOrder', keyAuth, processValue(['id']),async (req, res)=>{

})

router.get('/getPayments', keyAuth, processValue(['id']),async (req, res)=>{

})

router.get('/settlements', keyAuth, processValue(['id']),async (req, res)=>{

})



module.exports = routers