const express = require('express')
const app = express()
const PORT = process.env.PORT
require('./database/connect')
const cors = require('cors')
// const helmet = require('helmet')
// const rateLimit = require("express-rate-limit");


const studentGETRoutes = require('./Routes/studentRoutes/studentGET')
const studentLoginRoutes = require('./Routes/studentRoutes/studentLogin')
const studentRequestRoutes = require('./Routes/requestRoutes/student/request')
const studentPayRoutes = require('./Routes/receiptRoutes/student/receipt')

const adminStudentRoutes = require('./Routes/admin/studentUpdate/student')
const adminStudentDetailRoutes = require('./Routes/admin/detailedStudents/student')
const adminSuSubjectRoutes = require('./Routes/subjectRoutes/suAdminSubject')
const adminSiteSettingsRoutes = require('./Routes/admin/siteSettings/siteSettings')
const adminSiteSettingsInitRoutes = require('./Routes/admin/siteSettings/suSiteSettingsInit')
const adminReceiptsRoutes = require('./Routes/receiptRoutes/admin/receipt')
const adminSuReceiptsRoutes = require('./Routes/receiptRoutes/admin/suAdminReceipt')
const adminRequestRoutes = require('./Routes/requestRoutes/admin/request')
const paymentsHooks = require('./Routes/receiptRoutes/Hooks/hooks')
const adminSuRoutes = require('./Routes/suAdminRoutes/suAdmin')
const adminLoginRoutes = require('./Routes/admin/admin')
const adminHomeRoutes = require('./Routes/admin/Home/home')
const adminLoggerRoutes = require('./logger/getLogger')

var allowedOrigins = ['http://localhost:3000',
                      'http://yourapp.com'];

app.use(cors({
    origin: function(origin, callback){    // allow requests with no origin
        if(!origin) return callback(null, true);    
        if(allowedOrigins.indexOf(origin) === -1){
            var msg = 'The CORS policy for this site does not ' + 'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }       
        return callback(null, true);
},
credentials: true
}));

// const studentApiLimiter = rateLimit({
//     windowMs: 10 * 60 * 1000, // 15 minutes
//     max: 50,
//     message: "Too many request from this IP"
//   });

//   const adminApiLimiter = rateLimit({
//     windowMs: 10 * 60 * 1000, // 15 minutes
//     max: 500,
//     message: "Too many request from this IP"
//   });

// s
app.disable('x-powered-by')
app.use(express.json())

app.use('/api/student/auth', studentLoginRoutes)
app.use('/api/student/get', studentGETRoutes)
app.use('/api/student/fee', studentPayRoutes)
app.use('/api/student/request', studentRequestRoutes)

app.use('/payments/hooks', paymentsHooks)

app.use('/api/admin/home', adminHomeRoutes)
app.use('/api/admin/auth', adminLoginRoutes)
app.use('/api/admin/student', adminStudentRoutes)
app.use('/api/admin/detailStudent', adminStudentDetailRoutes)

app.use('/api/admin/settings', adminSiteSettingsRoutes)
app.use('/api/admin/settings/init', adminSiteSettingsInitRoutes)

app.use('/api/admin/receipts', adminReceiptsRoutes)
app.use('/api/admin/su/receipts', adminSuReceiptsRoutes)

app.use('/api/admin/request', adminRequestRoutes)

app.use('/api/admin/su/subject', adminSuSubjectRoutes)
app.use('/api/admin/logs', adminLoggerRoutes)

app.use('/api/admin/su', adminSuRoutes)






app.listen(PORT, ()=>{
    console.log('server is listening on port: ', PORT)
})