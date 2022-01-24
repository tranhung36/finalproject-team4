const express = require("express");
const router = express.Router();
const {
    index,
    show,
    sortByCategory
} = require('../controllers/product.controller')

/* GET product page. */
router.get('/:slug', show, (err) => {
    console.error(err.message)
    res.status(500).send('Server error')
});
router.get('/', index)
router.get('/category/:category.:id', sortByCategory)


module.exports = router