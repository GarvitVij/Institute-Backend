const express = require('express')
const app = express()
const PORT = process.env.PORT
require('./database/connect')
const adminStudentRoutes = require('./Routes/admin/student/student')
const studentGETRoutes = require('./Routes/studentRoutes/studentGET')
const studentLoginRoutes = require('./Routes/studentRoutes/studentLogin')
const subjectRoutes = require('./Routes/subjectRoutes/suAdminSubject')
const studentPayRoutes = require('./Routes/receiptRoutes/student/receipt')
const adminSiteSettingsRoutes = require('./Routes/admin/siteSettings/siteSettings')
const adminSiteSettingsInitRoutes = require('./Routes/admin/siteSettings/suSiteSettingsInit')

app.use(express.json())

app.use('/api/student/auth/', studentLoginRoutes)
app.use('/api/student/get', studentGETRoutes)
app.use('/api/student/pay', studentPayRoutes)

app.use('/api/admin', adminStudentRoutes)
app.use('/api/admin/settings', adminSiteSettingsRoutes)
app.use('/api/admin/settings/init', adminSiteSettingsInitRoutes)

app.use('/api/subject', subjectRoutes)




app.listen(PORT, ()=>{
    console.log('server is listening on port: ', PORT)
})