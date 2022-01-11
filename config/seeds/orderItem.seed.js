const OrderItem = require('../../models/orderItem.model')

module.exports = (req, res, next) => {
    OrderItem.create({productId: '61d2b307624e8c684dd09340', quantity: 5})
    res.status(200).send('Done')
}