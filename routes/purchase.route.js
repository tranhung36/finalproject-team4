const express = require('express')
const router = express.Router()
const {myOrders} = require('../controllers/profile.controller')

//follow bill
router.get('/', myOrders)
module.exports = router;
