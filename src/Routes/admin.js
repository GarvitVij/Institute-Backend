const express = require('express')
const router = new express.Router()
const Student = require('../Models/Student')
const errorHandler = require('../utils/errorHandler/errorHandler')

router.post('/students', async (req,res)=>{
    try{
        const saved = await Student.insertMany(req.body)
        res.send({saved},204)
    }catch(e){
        res.status(201).send(errorHandler(e))
    }
})


module.exports = router



