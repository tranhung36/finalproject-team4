const express = require('express');
const router = express.Router();
const siteRoute = require('./home.route')
const userRoute = require('./user.route')
const productRoute = require('./product.route')
const loginRoute = require('./login.route')
const registerRoute = require('./register.route')

router.use('/products', productRoute)
router.use('/login', loginRoute)
router.use('/register', registerRoute)
router.use('/user', userRoute)
router.use('/', siteRoute)

module.exports = router