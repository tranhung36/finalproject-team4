const express = require('express')
const router = express.Router()
const sellerController = require('../controllers/seller.controller')

router.get('/', async (req, res, next) => {
    res.render('seller/sellerPage');
})
//read
router.get('/crud-page', sellerController.renderCRUDPage)
//create
router.get('/crud-page/createProduct', sellerController.renderCreateProduct)
router.post('/crud-page/createProduct', sellerController.createProduct)
//delete
router.get('/crud-page/deleteProduct/:id', sellerController.deleteProduct)
//update
router.get('/crud-page/updateProduct/:id', sellerController.renderUpdateProduct)
router.put('/crud-page/updateProduct/:id', sellerController.updateProduct)

module.exports = router
