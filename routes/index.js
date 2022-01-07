const express = require('express');
const router = express.Router();
const siteRoute = require('./home.route')
const userRoute = require('./user.route')
const productRoute = require('./product.route')
const categoryRoute = require('./category.route')
const sellerRoute = require('./seller.route')

router.use('/products', productRoute)
router.use('/category', categoryRoute)
router.use('/user', userRoute)
router.use('/sellerPage', sellerRoute)
router.use('/', siteRoute)

module.exports = router