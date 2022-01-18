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
const {
    verifyToken
} = require('../middleware/auth.middleware')

// express().use(verifyToken)
//read
router.get('/my-products', verifyToken, renderCRUDPage)
//create
router.get('/create-product', renderCreateProduct)
router.post('/create-product', createProduct)
//delete
router.get('/delete-product/:slug.:id', deleteProduct)
//update
router.get('/update-product/:slug.:id', renderUpdateProduct)
router.put('/update-product/:slug.:id', updateProduct)
router.get('/', renderSellerPage)

router.get('/manage-orders', verifyToken, manageOrder)



module.exports = router