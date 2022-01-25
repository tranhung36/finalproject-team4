const Rate = require('../models/rate.model')
const Product = require('../models/product.model')
const OrderItem = require('../models/orderItem.model')
const userInfo = require('../services/user.service')

async function ratingHandle(req, res, next) {
    try {
        const {
            star,
            comment
        } = req.body
        const user = userInfo(req)
        const product = await Product.findOne({
            _id: req.params.id
        })
        const rate = await Rate.create({
            productId: product._id,
            userId: user.user_id,
            star,
            comment
        })
        const orderItem = await OrderItem.findOne({
            productId: product._id,
            isRate: false
        })
        if (rate) {
            const countRate = await Rate.aggregate([{
                    $match: {
                        'productId': product._id
                    }
                },
                {
                    $group: {
                        _id: '$star',
                        total: {
                            $sum: 1
                        }
                    }
                },
            ]).exec()
            const totalScore = countRate.reduce((prev, curr) => {
                return prev + (curr._id * curr.total)
            }, 0)
            const totalRate = countRate.reduce((prev, curr) => {
                return prev + curr.total
            }, 0)
            const result = Math.round(totalScore / totalRate)
            product.rating = result
            product.save()
            orderItem.isRate = true
            orderItem.save()
        }
        res.writeHead(303, {
            Location: req.headers.referer
        }).end()
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    ratingHandle
}