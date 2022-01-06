require('dotenv').config()
require('../config/database/db')
const Category = require('../models/category.model')
const Product = require('../models/product.model')

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
                slug: req.body.slug,
                price: Number(req.body.price),
                categoryId: req.body.category,
                description: req.body.description,
                thumbnail: newImageName,
                images: imageArray,
                userID: '1'
            });
            console.log(product);
            await product.save();
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
            const { productname, slug, price, category, description, thumbnail } = req.body
            await Product.findOneAndUpdate({ _id: req.params.id }, {
                name: productname, slug,
                price: Number(price), categoryId: category, description, thumbnail: newImageName
            })

            // imageUploadFiles = req.files.images;
            // let imageArray = []

            // imageUploadFiles.map(img => {
            //     newImageNames = Date.now() + img.name;

            //     uploadPaths = require('path').resolve('./') + '/public/images/' + newImageNames;

            //     img.mv(uploadPaths, function (err) {
            //         if (err) return res.satus(500).send(err);
            //     })
            //     imageArray.push(newImageNames);
            // })
            // console.log('mang',imageArray);

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