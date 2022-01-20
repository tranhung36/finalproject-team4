const express = require('express')
const router = express.Router()

//follow bill
router.get('/', (req, res, next) => {
    res.render('purchase/purchase', {
        title: 'Purchase',
    });
})

module.exports = router;
