const express = require('express')
const router = express.Router()
const Controller = require('../controller/leadsController')
const authMiddleware  = require('../authMiddleware')

router.post('/createLead',Controller.createLead)
router.put('/updateLead/:id',Controller.updateLead)
router.get('/getAllLeads',authMiddleware,Controller.getAllLeads)
router.post('/importLeadsFromCsv',authMiddleware,Controller.importLeadsFromCsv)
router.get('/getLeadById',authMiddleware,Controller.getLeadById)
router.post('/assignLead',authMiddleware,Controller.assignLead)
router.get('/getAllAssignee',authMiddleware,Controller.getAllAssignee)

module.exports = router;