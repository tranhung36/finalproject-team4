const express = require('express');
const router = express.Router();
const {
    register,
    login,
    logout
} = require('../controllers/auth.controller')
const {
    checkout,
    payment,
    successPayment,
    cancelPayment
} = require('../controllers/checkout.controller')
const {
    verifyToken
} = require('../middleware/auth.middleware')


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

router.get('/logout', logout)

router.get('/checkout', verifyToken, checkout)

router.post('/create-checkout-session', payment);

router.get('/success', successPayment)

router.get('/cancel', cancelPayment)

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('products/index', {
        title: 'Home',
        user: req.cookies['access_token']
    });
});


module.exports = router;