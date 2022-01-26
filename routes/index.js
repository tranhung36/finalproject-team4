const express = require('express');
const router = express.Router();
const siteRoute = require('./site.route')
const userRoute = require('./user.route')
const productRoute = require('./product.route')
const cartRoute = require('./cart.route')
const sellerRoute = require('./seller.route')
const cart = require('../middleware/cartItem.middleware')
const wishList = require('../middleware/wishList.middleware')
const searchRoute = require('./search.route')
const purchaseRoute = require('./purchase.route')
const rateRoute = require('./rate.route')
const {
    checkAuth,
    checkRole
} = require('../middleware/auth.middleware')
const adminRoute = require('./admin.route')

router.use('*', checkAuth)
router.use('*', checkRole)
router.use('*', cart)
router.use('*', wishList)
router.use('/cart', cartRoute)
router.use('/products', productRoute)
router.use('/user', userRoute)
router.use('/dashboard', sellerRoute)
router.use('/purchase', purchaseRoute)
router.use('/search', searchRoute)
router.use('/admin', adminRoute)
router.use('/rate', rateRoute)
router.use('/', siteRoute)


module.exports = router