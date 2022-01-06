const {register, login} = require('../controllers/auth.controller')
const express = require('express')
const router = express.Router();
//register
router.post("/register", register);

/* GET register page. */
router.get('/register', function (req, res, next) {
    res.render('register', {
        title: 'Register',
    });
});

// Login
router.post("/login", login);

/* GET login page. */
router.get('/login', function (req, res, next) {
    res.render('login', {
        title: 'Login',
    });
});

module.exports = router;