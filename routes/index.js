const express = require('express');
const router = express.Router();
const siteRoute = require('./home.route')
const userRoute = require('./user.route')
const productRoute = require('./product.route')
const cartRoute = require('./cart.route')
const categoryRoute = require('./category.route')


router.use('/cart', cartRoute)
router.use('/products', productRoute)
router.use('/category', categoryRoute)
router.use('/user', userRoute)
router.use('/', siteRoute)

module.exports = router