const express = require('express')
const router = express.Router()
const {
    myOrders
} = require('../controllers/profile.controller')
const {
    verifyToken
} = require('../middleware/auth.middleware')


router.get('/', verifyToken, myOrders)
module.exports = router;