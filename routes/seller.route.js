const express = require('express')
const router = express.Router()
const sellerController = require('../controllers/seller.controller')

router.get('/', sellerController.renderSellerPage)
//read
router.get('/crud-page', sellerController.renderCRUDPage)
//create
router.get('/crud-page/createProduct', sellerController.renderCreateProduct)
router.post('/crud-page/createProduct', sellerController.createProduct)
//delete
router.get('/crud-page/deleteProduct/:slug.:id', sellerController.deleteProduct)
//update
router.get('/crud-page/updateProduct/:slug.:id', sellerController.renderUpdateProduct)
router.put('/crud-page/updateProduct/:slug.:id', sellerController.updateProduct)

router.get('/searchValue', sellerController.renderSearch);

module.exports = router
