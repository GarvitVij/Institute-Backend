const express = require('express')
const { nanoid } = require('nanoid')
const processValue = require('../../middlewares/processValue')
const router  = express.Router()
const Admin = require('../../Models/Admin')

router.get('/allAdmins', async(req,res)=>{
    try{
        const admins = await Admin.find()
        res.status(200).send({admins})
    }catch(e){
        res.status(400).send({errorMessage: 'Please try again later !'})
    }   
})

router.get('/admin',processValue(['adminID']), async(req,res)=> {
    try{
        const admin = await Admin.findOne({adminID: req.body.adminID })
        if(!admin){
            return res.status(404).send({errorMessage: 'Admin not found'})
        }
        res.status(200).send({admin})
    }catch(e){
        res.status(400).send({errorMessage: 'Please try again later !'})
    }
})

router.post('/addAdmin', processValue(['adminID', 'name', 'email']), async(req,res)=>{
    try{
        const password = nanoid()
        let admin = new Admin({...req.body, password})
        admin = await admin.save()
        admin.password = password
        res.status(200).send({admin})
    }catch(e){
        res.status(400).send({errorMessage: 'Cant create admin ! try again.'})
    }
})

router.patch('/adminOperations', processValue(['allowOperation', 'adminID']), async(req,res)=>{
    try{
        console.log(req.body.allowOperation)
        if( typeof req.body.allowOperation !== "boolean"  ){
            return res.status(406).send({errorMessage: 'Invalid Body'})
        }
        const admin = await Admin.findOneAndUpdate({adminID: req.body.adminID}, {allowOperations: req.body.allowOperation})
        if(!admin){
            return res.status(404).send({errorMessage: 'Admin not found'})
        }
        res.status(200).send({message: 'Changed successfully !'})
    }catch(e){
        res.status(400).send({errorMessage: 'Cant update operations, Please try again !'})
    }
})

router.delete('/admin', processValue(['adminID']), async(req,res)=>{
    try{
        const admin  = await Admin.findOneAndDelete({adminID: req.body.adminID})
        if(!admin){
            return res.status(404).send({errorMessage: 'Admin not found'})
        }
        res.status(200).send({message: 'Deleted successfully !'})
    }catch(e){
        res.status(400).send({errorMessage: 'Cant delete admin right now, Please try again later !'})
    }
})


module.exports = router