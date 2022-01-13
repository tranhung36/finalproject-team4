const express = require('express');
const router = express.Router();
const {
    renderSearchBar,
    renderSearchPage,
    searchApi
} = require('../controllers/seller.controller')

router.get('/searchValue', renderSearchBar);
router.get('/page=:page', renderSearchPage);
router.get('/searchApi', searchApi)

module.exports = router;