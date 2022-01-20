const express = require('express');
const router = express.Router();
const {
    cart,
    addToCart,
    removeItemSingleFromCart,
    removeItemFromCart,
} = require('../controllers/orderItem.controller')
const fake = require('../config/seeds/orderItem.seed')
const {
    verifyToken
} = require('../middleware/auth.middleware')

router.get('/fake', fake)
router.get('/add-to-cart/:slug', verifyToken, addToCart)
router.get('/remove-single-from-cart/:slug', verifyToken, removeItemSingleFromCart)
router.get('/remove-from-cart/:slug', verifyToken, removeItemFromCart)
router.get('/', verifyToken, cart)
module.exports = router