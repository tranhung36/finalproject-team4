require('dotenv').config()
require('../config/database/db')
const slugURL = require('../middleware/slug')
const Category = require('../models/category.model')
const Product = require('../models/product.model')

exports.renderSellerPage = async (req, res, next) => {
    res.render('seller/sellerPage',);
}

exports.renderCRUDPage = async (req, res, next) => {
    const productByUserID = await Product.find({ userID: 1 })
    const categories = await Category.find()

    res.render('seller/crudPage', { productByUserID, categories });
}

exports.renderCreateProduct = async (req, res, next) => {
    const categories = await Category.find()
    res.render('seller/createProduct', { categories });
}

exports.createProduct = async (req, res) => {
    try {
        let imageUploadFiles;
        let uploadPaths;
        let newImageNames;

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
                userID: '1'
            });
            await product.save();
            res.redirect('/sellerPage/crud-page')
        }
    } catch (error) {

        res.redirect('/sellerPage/CRUD-Page');
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete({ _id: req.params.id })
        res.redirect('/sellerPage/crud-page')
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

exports.renderUpdateProduct = async (req, res) => {
    try {
        const products = await Product.find({ _id: req.params.id })
        const categories = await Category.find()
        res.render('seller/updateProduct', { products, categories })
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

exports.updateProduct = async (req, res) => {
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
            const { productname, price, category, stock, description } = req.body
            await Product.findOneAndUpdate({ _id: req.params.id }, {
                name: productname, slug:slugURL(req.body.productname), stock,
                price: Number(price), categoryId: category, description, thumbnail: newImageName
            })
            res.redirect('/sellerPage/crud-page')
        }
    } catch (error) {
        res.redirect('/sellerPage/CRUD-Page');
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete({ _id: req.params.id })
        res.redirect('/sellerPage/crud-page')
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

exports.renderSearch = async (req, res, next) => {
    const product = await Product.find()
    res.send({ product });
}
