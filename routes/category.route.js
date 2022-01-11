const express = require('express');
const router = express.Router();
const fake = require('../config/seeds/category.seed')

router.get('/fake', fake);

module.exports = router;