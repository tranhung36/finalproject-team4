const Product = require('../models/product.model')

async function index(req, res, next) {
    try {
        let perPage = 12; // số lượng sản phẩm xuất hiện trên 1 page
        let page = req.query.page || 1;

        let products = await Product.find()
            .skip(perPage * page - perPage)
            .limit(perPage)
            .sort("-price");

        let count = await Product.countDocuments();

        res.render('products/shop', {
            products, // sản phẩm trên một page
            current: page, // page hiện tại
            pages: Math.ceil(count / perPage), // tổng số các page
            count: count // tổng sản phẩm
        });
    } catch (err) {
        return res.status(500).json({
            msg: err.message
        });
    }
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

module.exports = {
    index,
    show,
}