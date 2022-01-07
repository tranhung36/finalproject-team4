const Product = require('../models/product.model')

function index(req, res, next) {
    res.render('products/shop', {
        title: 'Shop',
    });
}

async function show(req, res, next) {
    try {
        const product = await Product.findOne({
            slug: req.params.slug
        })

        if (!product) {
            return res.render('error', {
                message: 'Product not found',
                title: 'Not Found'
            })
        }

        res.render('products/detail', {
            title: 'Product',
            product
        })
    } catch (error) {
        next(error)
    }
}

function cart(req, res, next) {
    res.render('products/cart', {})
}

module.exports = {
    index,
    show,
    cart
}