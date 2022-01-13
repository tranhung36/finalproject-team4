const Category = require('../models/category.model')
const Product = require('../models/product.model')
const userInfo = require('../services/user.service')
const slugURL = require('../middleware/slug')

async function renderSellerPage(req, res) {
    res.render('seller/sellerPage', );
}

async function renderCRUDPage(req, res) {
    // get all products corresponding to the person who logged in
    const productByUserID = await Product.find({
        userID: userInfo(req).user_id
    })
    const categories = await Category.find()

    res.render('seller/crudPage', {
        productByUserID,
        categories
    });
}

async function renderCreateProduct(req, res) {
    const categories = await Category.find()
    res.render('seller/createProduct', {
        categories
    });
}

async function createProduct(req, res) {
    try {
        // image Array
        let imageUploadFiles;
        let uploadPaths;
        let newImageNames;
        // image single
        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if (!req.files || Object.keys(req.files).length === 0) {
            console.log('No Files where uploaded.');
        } else {

            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;
            uploadPath = require('path').resolve('./') + '/public/images/' + newImageName;

            imageUploadFile.mv(uploadPath, function (err) {
                if (err) return res.satus(500).send(err);
            })

            imageUploadFiles = req.files.images;
            let imageArray = []

            imageUploadFiles.map(img => {
                newImageNames = Date.now() + img.name;

                uploadPaths = require('path').resolve('./') + '/public/images/' + newImageNames;

                img.mv(uploadPaths, function (err) {
                    if (err) return res.satus(500).send(err);
                })
                imageArray.push(newImageNames);
            })

            const product = new Product({
                name: req.body.productname,
                slug: slugURL(req.body.productname),
                price: Number(req.body.price),
                stock: Number(req.body.stock),
                categoryId: req.body.category,
                description: req.body.description,
                thumbnail: newImageName,
                images: imageArray,
                userID: userInfo(req).user_id
            });
            await product.save();
            res.redirect('/sellerPage/crud-page')
        }
    } catch (error) {
        res.status(500).send({
            message: error.message || "Error Occured"
        });
    }
}

async function deleteProduct(req, res) {
    try {
        await Product.findByIdAndDelete({
            _id: req.params.id
        })
        res.redirect('/sellerPage/crud-page')
    } catch (error) {
        res.status(500).send({
            message: error.message || "Error Occured"
        });
    }
}

async function renderUpdateProduct(req, res) {
    try {
        const products = await Product.find({
            _id: req.params.id
        })
        const categories = await Category.find()
        res.render('seller/updateProduct', {
            products,
            categories
        })
    } catch (error) {
        res.status(404).send({
            message: error.message || "Error Occured"
        });
    }
}

async function updateProduct(req, res) {
    try {
        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if (!req.files || Object.keys(req.files).length === 0) {
            console.log('No Files where uploaded.');
        } else {

            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;
            uploadPath = require('path').resolve('./') + '/public/images/' + newImageName;

            imageUploadFile.mv(uploadPath, function (err) {
                if (err) return res.satus(500).send(err);
            })
            const {
                productname,
                price,
                category,
                stock,
                description
            } = req.body
            await Product.findOneAndUpdate({
                _id: req.params.id
            }, {
                name: productname,
                slug: slugURL(req.body.productname),
                stock,
                price: Number(price),
                categoryId: category,
                description,
                thumbnail: newImageName
            })
            res.redirect('/sellerPage/crud-page')
        }
    } catch (error) {
        res.status(500).send({
            message: error.message || "Error Occured"
        });
    }
}

async function renderSearchPage(req, res) {
    try {
        // get key
        const key = req.query.key.toLowerCase()
        //get all products corresponding to key
        const products = await Product.find()
        const data = products.filter(value => {
            return value.name.toLowerCase().includes(key.toLowerCase())
        })
        // paginate
        const productPerPage = 8
        const pages = Math.ceil(data.length / productPerPage)
        const page = Number(req.params.page)
        let pagination = data.slice(productPerPage * page, productPerPage * (1 + page))
        res.render('seller/searchPage', {
            pagination,
            key,
            pages
        })
    } catch (error) {
        res.status(404).send({
            message: error.message || "Error Occured"
        });
    }
}

//API 
async function renderSearchBar(req, res) {
    const product = await Product.find()
    res.send({
        product
    });
}

async function searchApi(req, res) {
    try {
        // get key
        const key = req.query.key.toLowerCase()
        //get all products corresponding to key
        const products = await Product.find()
        const data = products.filter(value => {
            return value.name.toLowerCase().includes(key.toLowerCase())
        })
        res.send({
            data,
            key
        })
    } catch (error) {
        res.status(404).send({
            message: error.message || "Error Occured"
        });
    }
}

module.exports = {
    renderSellerPage,
    renderCRUDPage,
    renderCreateProduct,
    createProduct,
    deleteProduct,
    renderUpdateProduct,
    updateProduct,
    renderSearchBar,
    renderSearchPage,
    searchApi
}