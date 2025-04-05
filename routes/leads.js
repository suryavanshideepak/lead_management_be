const express = require('express')
const router = express.Router()
const Controller = require('../controller/leadsController')
const authMiddleware  = require('../authMiddleware')

router.post('/createLead',Controller.createLead)
router.post('/getAllLeads',authMiddleware,Controller.getAllLeads)

module.exports = router;