const Subjects = require('../../Models/Subject')

const validatePaymentObject = async(req,res,next) => {
    if(!req.student || (!req.body.subjects && !req.body.semester)){
        return res.send({error: 'Invalid Body'})
    }
    if(req.student.currentSemester !== req.body.semester){
        return res.send({error: 'Invalid Semester'})
    }
    try{
        for(let i = 0; i<req.body.subjects.length;i++){
            const AllowedSubjects = await Subjects.findOne({semester: req.body.subjects[i].semester, branch: req.student.branch})
            const AllowedValues = req.body.subjects[i].subjects.every(subject => AllowedSubjects.subjects.includes(subject))
            if(!AllowedValues){
                return res.send({error:'Invalid Subjects'})
            }
        }
        next()
    }catch(e){
        return res.send({error: 'Invalid Body'})
    }
}

module.exports= validatePaymentObject