const express = require('express')
const app = express()
const PORT = process.env.PORT
require('./database/connect')
const cors = require('cors')
const adminStudentRoutes = require('./Routes/admin/student/student')
const studentGETRoutes = require('./Routes/studentRoutes/studentGET')
const studentLoginRoutes = require('./Routes/studentRoutes/studentLogin')
const adminSuSubjectRoutes = require('./Routes/subjectRoutes/suAdminSubject')
const studentPayRoutes = require('./Routes/receiptRoutes/student/receipt')
const adminSiteSettingsRoutes = require('./Routes/admin/siteSettings/siteSettings')
const adminSiteSettingsInitRoutes = require('./Routes/admin/siteSettings/suSiteSettingsInit')
const adminReceiptsRoutes = require('./Routes/receiptRoutes/admin/receipt')
const adminSuReceiptsRoutes = require('./Routes/receiptRoutes/admin/suAdminReceipt')

app.use(cors());
app.use(express.json())

app.use('/api/student/auth/', studentLoginRoutes)
app.use('/api/student/get', studentGETRoutes)
app.use('/api/student/fee', studentPayRoutes)

app.use('/api/admin', adminStudentRoutes)

app.use('/api/admin/settings', adminSiteSettingsRoutes)
app.use('/api/admin/settings/init', adminSiteSettingsInitRoutes)

app.use('/api/admin/receipts', adminReceiptsRoutes)
app.use('/api/admin/su/receipts', adminSuReceiptsRoutes)

app.use('/api/admin/su/subject', adminSuSubjectRoutes)




app.listen(PORT, ()=>{
    console.log('server is listening on port: ', PORT)
})