const express = require('express')
const router = express.Router()
const {
    ratingHandle
} = require('../controllers/rate.controller')
const {
    verifyToken
} = require('../middleware/auth.middleware')


router.post('/:id', verifyToken, ratingHandle)

module.exports = router;