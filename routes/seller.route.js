const express = require('express')
const router = express.Router()
const {
    renderSellerPage,
    renderCRUDPage,
    renderCreateProduct,
    createProduct,
    deleteProduct,
    renderUpdateProduct,
    updateProduct,
    manageOrder,
    statistical,
    statisticalApi,
    inventoryDetails,
    deleteProductApi
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
//statistical
router.get('/statistical', verifyToken, statistical)
router.get('/statisticalApi', verifyToken, statisticalApi)
router.get('/deleteProductApi', verifyToken, deleteProductApi)
router.get('/statistical/inventory-details', verifyToken, inventoryDetails)

module.exports = router