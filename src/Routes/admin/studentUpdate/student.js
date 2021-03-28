const express = require('express')
const router = new express.Router()
const Student = require('../../../Models/Student')
const Request = require('../../../Models/Update')
const errorHandler = require('../../../utils/errorHandler/errorHandler')
const processValue = require('../../../middlewares/processValue')
const multer = require('multer')
const { convertArrayToCSV } = require('convert-array-to-csv');
const { encrypt , decrypt } = require('../../../utils/fileEncrypt/fileEncrypt')

const gtbpiFileUpload = multer({
    limits: {
        fileSize: 500000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.gtbpi$/)) {
            return cb('upload gtbpi file please', undefined)
        }
        cb(undefined, true)
    }
})
const gtbpiFile = gtbpiFileUpload.single('data')

router.post('/',async (req,res)=>{
    gtbpiFile(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err)
            return res.status(415).send({ errorMessage: 'Please try again !' })
        } else if (err) {
            console.log(err)
            return res.status(406).send({ errorMessage: 'Please try again !' })
        }
        try{
            data = await decrypt(req.file.buffer)
            req.data = JSON.parse(data.toString())
            const saved = await Student.insertMany(req.data)
            res.status(200).send({saved})
        }catch(e){
            console.log(e)
            res.status(400).send({errorMessage: 'Please try again !'})
        }
    })
})

router.post('/encryptData', processValue(['data']),async(req,res)=> {
    try{
        if(typeof(req.body.data) === "string"){
            req.body.data = JSON.parse(req.body.data)
        }
        req.body.data.forEach((data,index) => {
            req.body.data[index].rollNumber  = parseInt(data.rollNumber)
            req.body.data[index].currentSemester = parseInt(data.currentSemester)
            req.body.data[index].isLateralEntry = data.isLateralEntry === "TRUE" ? true : false
            req.body.data[index].phoneNumber = parseInt(data.phoneNumber)
            req.body.data[index].branch = data.branch.charAt(0).toUpperCase() + data.branch.slice(1)
            Student.validate(data)
        })

        const JSONbuffer = Buffer.from(JSON.stringify(req.body.data))
        const file = await encrypt(JSONbuffer)
        res.set('Content-Type', 'application/gtbpi')
        res.status(200).send(file)
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: 'something went wrong, please try again !'})
    }
})

router.delete('/batch', processValue(['batch']), async(req,res)=>{
    try{
        if(typeof(req.body.batch) !== "string" || req.body.batch.split("|").length !== 4) throw new Error()
        req.body.batch = req.body.batch.split("|")
        const branch = req.body.batch[0]
        const timing = req.body.batch[1]
        const batch = req.body.batch[2]
        const currentSemester = req.body.batch[3]
        const removed = await Student.deleteMany({branch: branch.trim(), timing: timing.trim(), batch: batch.trim(), currentSemester: currentSemester})
        res.status(204).send({message: 'Deleted successfully!'})
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: "Something went wrong"})
    }
})

router.delete('/', processValue(['students']), async(req,res)=>{
    try{
        if(typeof(req.body.students) !== "object") throw new Error()
        const isTrue = req.body.students.every(student => typeof(student) === "number")
        if(!isTrue) throw new Error()
        const removed = await Student.deleteMany({rollNumber: {$in: req.body.students}})
        res.status(200).send(removed) 
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage:"something went wrong"})
    }
})

router.patch('/incSem', async(req,res)=>{
    try{
        const updated = await Student.updateMany({currentSemester: {$lt: 6}}, { $inc: {'currentSemester': 1}, hasPaid: false })
        await Request.collection.drop()
        res.status(200).send(updated)
    }catch(e){
        console.log(e)
        return res.status(400).send({errorMessage: 'Something went wrong'})
    }
})

router.patch('/passHold', processValue(['students', 'type']) ,async(req,res)=>{
    try{
        if(typeof(req.body.students) !== "object" || typeof(req.body.type) !== "string") throw new Error()
        const validRollNumbers = req.body.students.every(student => typeof(student) === "number")
        const validType = req.body.type === "pass" || req.body.type === "hold" 
        if(!validRollNumbers || !validType) throw new Error()

        if(req.body.type === "pass"){
            const removed = await Student.deleteMany({rollNumber: {$in: req.body.students}, currentSemester:{$gt: 5}})
            res.status(200).send(removed) 
        }
        if(req.body.type === "hold"){
            const updated = await Student.updateMany({rollNumber: {$in: req.body.students}, currentSemester:{$gt: 5}}, {$inc: {'currentSemester': 1}, hasPaid: false })
            res.status(200).send(updated) 
        }

    }catch(e){
        console.log(e)
        return res.status(400).send({errorMessage: 'Something went wrong'})
    }
})

router.get('/batch', processValue(['batch']), async(req,res)=>{
    try{
        if(typeof(req.body.batch) !== "string" || req.body.batch.split("|").length !== 4) throw new Error()
        req.body.batch = req.body.batch.split("|")
        const branch = req.body.batch[0]
        const timing = req.body.batch[1]
        const batch = req.body.batch[2]
        const currentSemester = req.body.batch[3]
        const data = await Student.find({branch: branch.trim(), timing: timing.trim(), batch: batch.trim(), currentSemester: currentSemester})
        data.forEach((data,index)=>{
            delete data._id
            delete data.password
            delete data.tokens
            delete data.__v
            delete data.createdAt
            delete data.updatedAt
        })
        console.log(data)
        const csvFromArrayOfObjects = convertArrayToCSV(data);
        console.log(csvFromArrayOfObjects)
        const dataBuffer = Buffer.from(csvFromArrayOfObjects);
        res.set('Content-Type', 'application/csv')
        res.status(200).send(dataBuffer)
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: "Something went wrong"})
    }
})



module.exports = router