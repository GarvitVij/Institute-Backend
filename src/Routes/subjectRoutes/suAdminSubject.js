const express = require('express')
const router = new express.Router()
const keyAuth = require('../../middlewares/keyAuth')
const processValue = require('../../middlewares/processValue')
const errorHandler = require('../../utils/errorHandler/errorHandler')
const Subject = require('../../Models/Subject')

router.get('/', 
            keyAuth,
            processValue(['semester', 'branch']),
            async(req,res)=>{
                try{
                    const subjects = await Subject.findOne({semester: req.body.semester, branch : req.body.branch })
                    if(!subjects) {
                        return res.status(404).send({error: "Subjects Not found"})
                    }
                    return res.send(subjects)
                }catch(e){
                    return res.status(500).send({error: "Server internal error"})
                }
            }
            
)



router.post('/', 
            keyAuth , 
            processValue(['branch', 'semester', 'subjects']) ,
            async(req,res) => {
                try{
                    const subjects = await Subject.findOne({semester: req.body.semester, branch: req.body.branch})
                    if(!subjects){
                        if(req.body.semester > 6){
                            return res.send({error: "Semester cannot be bigger than 6"})
                        }
                        const subject = await Subject.create(req.body)
                        return res.send({subject, created:true})
                    }else{
                        req.body.subjects.forEach(subject => {
                            if(typeof(subject) !== "string") return res.send({error: "please provide a string"})})
                        const subject  = await Subject.findByIdAndUpdate({_id: subjects._id},{subjects: req.body.subjects})
                        return res.send({subject})
                    }
                }catch(e){
                    return res.send(errorHandler(e))
                }
            }
)

router.delete('/', 
            keyAuth, 
            processValue(['semester', 'branch']),
            async(req,res)=>{
                try{
                    let subject = await Subject.findOneAndDelete({semester: req.body.semester, branch: req.body.branch})
                    if(!subject){
                        return res.status(404).send({error: 'Subject not found'})
                    }
                    return res.status(202).send({subject})
                }catch(e){
                    return res.send(errorHandler(e))
                }
            }
)


module.exports = router