const express = require('express');
const router = express.Router();

/* GET register page. */
router.get('/', function (req, res, next) {
    res.render('register', {
        title: 'Register',
    });
});

module.exports = router;