const express = require('express')
const router = new express.Router()
const SiteSettings = require('../../../Models/Settings')
const keyAuth = require('../../../middlewares/keyAuth')
const processValue = require('../../../middlewares/processValue')

router.post('/', keyAuth, processValue(['force']) ,async (req,res)=>{
    try{
        let init = await SiteSettings.findOne()
       
        if(init){
            if(req.body.force !== true){
                return res.send({success: 'Already initialized'})
            }
        }
        const notices = [{title: '', desc: ''},{title: '', desc: ''},{title: '', desc: ''},{title: '', desc: ''},{title: '', desc: ''}]
        init = new SiteSettings({notices})
        await init.save()
        res.send({created: true})
    }catch(e){
        console.log(e)
        res.send({error: "Something went wrong, try again"})
    }
})

module.exports = router