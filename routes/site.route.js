const express = require('express');
const router = express.Router();
const {
    register,
    login,
    logout
} = require('../controllers/auth.controller')
const {
    checkout,
    checkoutHandle,
    payment
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

router.post('/checkout', checkoutHandle)

router.get('/checkout', verifyToken, checkout)

router.get('/payment', (req, res) => {
    res.render('products/payment')
})

router.post('/create-checkout-session', payment);

router.get('/success', (req, res) => {
    res.render('success')
})

router.get('/cancel', (req, res) => {
    res.render('cancel')
})

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('products/index', {
        title: 'Home',
        user: req.cookies['access_token']
    });
});


module.exports = router;