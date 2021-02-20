const express = require('express')
const app = express()
const PORT = process.env.PORT
require('./database/connect')
const adminRoutes = require('./Routes/admin')
const studentGETRoutes = require('./Routes/studentGET')
const subjectRoutes = require('./Routes/subject')

app.use(express.json())

app.use('/api/admin', adminRoutes)
app.use('/api/student/get', studentGETRoutes)
app.use('/api/subject', subjectRoutes)

app.listen(PORT, ()=>{
    console.log('server is listening on port: ', PORT)
})