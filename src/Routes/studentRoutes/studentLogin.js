const express = require('express')
const router = new express.Router()
const processValue = require('../../middlewares/processValue')
const Student = require('../../Models/Student')
const {encrypt, decrypt} = require('../../utils/textEncryption/textEncrypt')
const studentAuth = require('../../middlewares/studentAuth')

router.post('/login', 
            processValue(['rollNumber', 'password']), 
            async(req,res)=>{
                try{
                    const student = await Student.findByCredentials(req.body)
                    token = await student.generateAuthToken()
                    token = encrypt(token)
                    res.cookie('token', token, {
                        expires: new Date(Date.now() + 10800000),
                        secure: true,
                        path: "/",
                        httpOnly: false
                    })
                    res.status(200).send({isSuccess: true})
                }catch(e){
                    res.status(401).send({isSuccess: false})
                }
})

router.delete('/logout', studentAuth, async(req,res)=>{
    try{
        req.student.tokens = []
        await req.student.save()
        res.clearCookie('token')
        res.clearCookie('name')
        res.status(204).send()
    }catch(e){
        res.clearCookie('token')
        res.status(200).send()
    }
})

router.post('/resetpwd',processValue(['rollNumber']) ,async(req,res)=>{
    let student = {}
    try{
        student = await Student.recoverPassword(req.body.rollNumber)
        if(!student.link){
           throw new Error()
        }
        console.log(`Sending mail...`)
        console.log(`${req.header('host')}${student.link}`)
        return res.status(200).send({message: "You will shortly receive an email !"})
    }catch(e){
        return res.status(500).send(student.error)
    }
})

router.patch('/resetpwd/:token', processValue(['password']), async(req,res)=>{
    try{
        const decryptedToken = decrypt(req.params.token)
        await Student.resetPassword(decryptedToken, req.body.password)
        res.send(204).send()
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router