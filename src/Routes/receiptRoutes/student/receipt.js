const express = require('express')
const processValue = require('../../../middlewares/processValue')
const studentAuth = require('../../../middlewares/studentAuth')
const router = new express.Router()


router.post('/', studentAuth, processValue(['subjects']), async(req,res)=>{
    console.log(req.student)
    console.log(req.body.subjects)
})

module.exports = router