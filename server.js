const express = require('express')
const app = express()
const PORT = process.env.PORT
require('./src/database/connect')
const cors = require('cors')
// const helmet = require('helmet')
// const rateLimit = require("express-rate-limit");


const studentGETRoutes = require('./src/Routes/studentRoutes/studentGET')
const studentLoginRoutes = require('./src/Routes/studentRoutes/studentLogin')
const studentRequestRoutes = require('./src/Routes/requestRoutes/student/request')
const studentPayRoutes = require('./src/Routes/receiptRoutes/student/receipt')

const adminStudentRoutes = require('./src/Routes/admin/studentUpdate/student')
const adminStudentDetailRoutes = require('./src/Routes/admin/detailedStudents/student')
const adminSuSubjectRoutes = require('./src/Routes/subjectRoutes/suAdminSubject')
const adminSiteSettingsRoutes = require('./src/Routes/admin/siteSettings/siteSettings')
const adminSiteSettingsInitRoutes = require('./src/Routes/admin/siteSettings/suSiteSettingsInit')
const adminReceiptsRoutes = require('./src/Routes/receiptRoutes/admin/receipt')
const adminSuReceiptsRoutes = require('./src/Routes/receiptRoutes/admin/suAdminReceipt')
const adminRequestRoutes = require('./src/Routes/requestRoutes/admin/request')
const paymentsHooks = require('./src/Routes/receiptRoutes/Hooks/hooks')
const adminSuRoutes = require('./src/Routes/suAdminRoutes/suAdmin')
const adminLoginRoutes = require('./src/Routes/admin/admin')
const adminHomeRoutes = require('./src/Routes/admin/Home/home')
const adminLoggerRoutes = require('./src/logger/getLogger')

var allowedOrigins = ['http://localhost:3000,','https://admin-gtbpi.netlify.app/','https://student-gtbpi.netlify.app/'];

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