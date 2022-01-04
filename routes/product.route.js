const express = require('express');
const router = express.Router();
const {
    index,
    show,
    cart
} = require('../controllers/product.controller')

/* GET product page. */
router.get('/cart', cart);
router.get('/:slug', show);
router.get('/', index);

module.exports = router;