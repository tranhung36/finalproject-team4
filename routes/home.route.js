const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('products/index', {
        title: 'Home'
    });
});

module.exports = router;