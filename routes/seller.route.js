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
    manageOrder
} = require('../controllers/seller.controller')


//read
router.get('/my-products', renderCRUDPage)
//create
router.get('/create-product', renderCreateProduct)
router.post('/create-product', createProduct)
//delete
router.get('/delete-product/:slug.:id', deleteProduct)
//update
router.get('/update-product/:slug.:id', renderUpdateProduct)
router.put('/update-product/:slug.:id', updateProduct)
router.get('/', renderSellerPage)

router.get('/manage-orders', manageOrder)



module.exports = router