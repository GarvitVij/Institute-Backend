const express = require('express')
const app = express()
const PORT = process.env.PORT
require('./database/connect')
const adminRoutes = require('./Routes/admin')
const studentGETRoutes = require('./Routes/studentRoutes/studentGET')
const studentLoginRoutes = require('./Routes/studentRoutes/studentLogin')
const subjectRoutes = require('./Routes/subject')

app.use(express.json())

app.use('/api/admin', adminRoutes)

app.use('/api/subject', subjectRoutes)

app.use('/api/student/get', studentGETRoutes)
app.use('/api/student/auth/', studentLoginRoutes)

app.listen(PORT, ()=>{
    console.log('server is listening on port: ', PORT)
})