const express = require('express');
const router = express.Router();
const siteRoute = require('./home.route')
const userRoute = require('./user.route')

router.use('/user', userRoute)
router.use('/', siteRoute)

module.exports = router