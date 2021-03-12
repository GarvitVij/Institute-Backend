const express = require('express')
const router  = new express.Router()

router.get('/allAdmins')

router.get('/admin')

router.post('/addAdmin')

router.patch('/admin')

router.delete('/admin')


module.export = router