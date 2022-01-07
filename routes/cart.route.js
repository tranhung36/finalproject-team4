const express = require('express');
const router = express.Router();
const {
    cart,
    addToCart
} = require('../controllers/orderItem.controller')
const fake = require('../config/seeds/orderItem.seed')

router.get('/fake', fake)
router.get('/', cart);

module.exports = router;