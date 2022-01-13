const express = require('express')
const router = express.Router()
const sellerController = require('../controllers/seller.controller')
const {
    renderSellerPage,
    renderCRUDPage,
    renderCreateProduct,
    createProduct,
    deleteProduct,
    renderUpdateProduct,
    updateProduct,
    renderSearchBar,
    renderSearchPage
} = require('../controllers/seller.controller')

router.get('/', renderSellerPage)
//read
router.get('/crud-page', renderCRUDPage)
//create
router.get('/crud-page/createProduct', renderCreateProduct)
router.post('/crud-page/createProduct', createProduct)
//delete
router.get('/crud-page/deleteProduct/:slug.:id', deleteProduct)
//update
router.get('/crud-page/updateProduct/:slug.:id', renderUpdateProduct)
router.put('/crud-page/updateProduct/:slug.:id', updateProduct)

router.get('/searchValue', renderSearchBar);
router.get('/search&page=:page', renderSearchPage);
module.exports = router
