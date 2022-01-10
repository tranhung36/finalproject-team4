
const slugURL = require('../middleware/slug')
const Category = require('../models/category.model')
const Product = require('../models/product.model')
const parseJWT = require('../middleware/parseJWT')

async function renderSellerPage(req,res){
    res.render('seller/sellerPage',);
}

async function renderCRUDPage(req,res){

    const productByUserID = await Product.find({ userID: parseJWT(req.cookies.access_token).user_id })
    const categories = await Category.find()

    res.render('seller/crudPage', { productByUserID, categories });
}

async function renderCreateProduct(req,res){
    const categories = await Category.find()
    res.render('seller/createProduct', { categories });
}

async function createProduct(req,res){
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
                userID: parseJWT(req.cookies.access_token).user_id
            });
            await product.save();
            res.redirect('/sellerPage/crud-page')
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

async function deleteProduct(req,res){
    try {
        await Product.findByIdAndDelete({ _id: req.params.id })
        res.redirect('/sellerPage/crud-page')
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

async function renderUpdateProduct(req,res){
    try {
        const products = await Product.find({ _id: req.params.id })
        const categories = await Category.find()
        res.render('seller/updateProduct', { products, categories })
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

async function updateProduct(req,res){
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

async function renderSearch(req,res){
    const product = await Product.find()
    res.send({ product });
}

module.exports = {
    renderSellerPage,
    renderCRUDPage,
    renderCreateProduct,
    createProduct,
    deleteProduct,
    renderUpdateProduct,
    updateProduct,
    renderSearch
}