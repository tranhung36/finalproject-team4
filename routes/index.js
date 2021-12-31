const express = require('express');
const router = express.Router();
const siteRoute = require('./home.route')
const userRoute = require('./user.route')
const productRoute = require('./product.route')

router.use('/product', productRoute)
router.use('/user', userRoute)
router.use('/', siteRoute)

module.exports = router