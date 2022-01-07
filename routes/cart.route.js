const express = require('express');
const router = express.Router();
const {
    cart,
    addToCart
} = require('../controllers/orderItem.controller')
const fake = require('../config/seeds/orderItem.seed')
const auth = require('../middleware/auth.middleware')

router.get('/fake', fake)
router.get('/', auth, cart);

module.exports = router;