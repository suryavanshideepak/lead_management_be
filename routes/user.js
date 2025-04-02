const express = require('express')
const Controller = require('../controller/userController')
const router = express.Router()
const authMiddleware = require('../authMiddleware')

router.post('/login',Controller.login)
router.post('/forgotPassword',Controller.forgotPassword)
router.post('/createUser',authMiddleware,Controller.createUserByAdmin)
router.get('/getAllUser',authMiddleware,Controller.getAllUser)
router.delete('/removeUser',authMiddleware,Controller.removeUser)

module.exports = router;