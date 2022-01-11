const express = require('express');
const router = express.Router();
const {
    register,
    login
} = require('../controllers/auth.controller')

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('products/index', {
        title: 'Home'
    });
});

router.post('/', (req, res, next) => {
    console.log(req.body.email);
});
//register
router.post("/register", register);

/* GET register page. */
router.get('/register', (req, res, next) => {
    res.render('register', {
        title: 'Register',
    });
});

// Login
router.post("/login", login);

/* GET login page. */
router.get('/login', (req, res, next) => {
    res.render('login', {
        title: 'Login',
    });
});

module.exports = router;