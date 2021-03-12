const express = require('express')
const router = new express.Router()
const SiteSettings = require('../../../Models/Settings')
const processValue = require('../../../middlewares/processValue')
const errorHandler = require('../../../utils/errorHandler/errorHandler')
const logger = require('../../../logger/logger')

router.get('/', async(req,res)=>{
    try{
        const data = await SiteSettings.findOne()
        if(!data){throw new Error()}
        res.send({data})
    }catch(e){
        res.send({error: 'cant fetch data, try again !'})
    }
})

router.patch('/notices', processValue(['notices']), async (req,res)=>{
    try{
        if(!req.body.notices){
            return res.send({error: "notices should be an array"})
        }
        const settings = await SiteSettings.findOne()
        if(!settings){
            return res.send({error: 'Please contact admin'})
        }    
        const err_notices = []
        const notices = []
        req.body.notices.slice(0, 5).forEach((notice,index)=> {
            if(notice.title && (notice.title.length > 1 && notice.title.length < 1000) && notice.desc && (notice.desc.length > 1 && notice.desc.length < 2000) ){
                notices.push(notice)
            }else{
                notices.push({title: '', desc: ''})
                err_notices.push(notice)
            }
        })   
        settings.notices = notices
        const savedNotices = await SiteSettings.findOneAndUpdate({notices: notices})
        logger(204, "adminOne", "Updated Notices", 1)
        res.send({savedNotices})
    
    }catch(e){
        console.log(e)
        res.send(errorHandler(e))
    }
})

router.patch('/fee', 
            processValue(['normalFee', 'backExamFee','maxPerSemesterFee','minLateFeeDate','maxLateFeeDate','minLateFee', 'maxLateFee' ]), 
            async(req,res)=>{
                try{
                    const settings = await SiteSettings.findOne()
                    if(!settings){
                        return res.send({error: 'Please contact admin'})
                    }    
                    values = Object.keys(req.body)
                    values.forEach(value => {
                        settings[value] = Number(req.body[value]) 
                    });
                    const savedSetting = await settings.save()
                    res.send({savedSetting})
                }catch(e){
                    console.log(e)
                    res.send({error: 'cant update settings now'})
                }
})

module.exports = router