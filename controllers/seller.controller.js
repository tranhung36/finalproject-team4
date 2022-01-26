const {
    ChildCategory
} = require('../models/category.model')
const Product = require('../models/product.model')
const OrderItem = require('../models/orderItem.model')
const mongoose = require("mongoose")
const userInfo = require('../services/user.service')
const slugify = require('slugify')
const formatDMY = require('../utils/formatDMY')

function renderSellerPage(req, res) {
    res.render('seller/sellerPage', {
        layout: 'layouts/layout_seller',
    });
}

async function renderCRUDPage(req, res) {
    // get all products corresponding to the person who logged in
    const productByUserID = await Product.find({
        userID: userInfo(req).user_id
    })
    const categories = await ChildCategory.find()

    res.render('seller/crudPage', {
        layout: 'layouts/layout_seller',
        productByUserID,
        categories
    });
}

async function renderCreateProduct(req, res) {
    const categories = await ChildCategory.find()
    res.render('seller/createProduct', {
        layout: 'layouts/layout_seller',
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
                if (err) return res.status(500).send(err);
            })

            imageUploadFiles = req.files.images;
            let imageArray = []

            imageUploadFiles.map(img => {
                newImageNames = Date.now() + img.name;

                uploadPaths = require('path').resolve('./') + '/public/images/' + newImageNames;

                img.mv(uploadPaths, function (err) {
                    if (err) return res.status(500).send(err);
                })
                imageArray.push(newImageNames);
            })

            const product = new Product({
                name: req.body.productname,
                price: Number(req.body.price),
                stock: Number(req.body.stock),
                categoryId: req.body.category,
                description: req.body.description,
                thumbnail: newImageName,
                images: imageArray,
                userID: userInfo(req).user_id
            });
            await product.save();
            res.redirect('/dashboard/my-products')
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
        res.redirect('/dashboard/my-products')
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
        const categories = await ChildCategory.find()
        res.render('seller/updateProduct', {
            layout: 'layouts/layout_seller',
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
                slug: slugify(req.body.productname, {
                    replacement: '-', // replace spaces with replacement character, defaults to `-`
                    remove: undefined, // remove characters that match regex, defaults to `undefined`
                    lower: true, // convert to lower case, defaults to `false`
                    strict: false, // strip special characters except replacement, defaults to `false`
                    locale: 'vi', // language code of the locale to use
                    trim: true // trim leading and trailing replacement chars, defaults to `true`
                }),
                stock,
                price: Number(price),
                categoryId: category,
                description,
                thumbnail: newImageName
            })
            res.redirect('/dashboard/my-products')
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

async function manageOrder(req, res, next) {
    try {
        const user = userInfo(req)
        const orderItems = await OrderItem.aggregate([{
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'productId'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'buyer'
                }
            },
            {
                $lookup: {
                    from: 'billingaddresses',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'userAddress'
                }
            },
            {
                $unwind: '$userAddress'
            },
            {
                $unwind: '$productId'
            },
            {
                $unwind: '$buyer'
            },
            {
                $match: {
                    'productId.userID': new mongoose.Types.ObjectId(user.user_id),
                    'ordered': true
                }
            },
            {
                $group: {
                    _id: '$_id',
                    productName: {
                        $first: '$productId.name'
                    },
                    status: {
                        $first: '$status'
                    },
                    buyer: {
                        $first: '$buyer'
                    },
                    orderedDate: {
                        $first: '$createdAt'
                    },
                    totalQuantity: {
                        $sum: '$quantity'
                    },
                    userAddress: {
                        $first: '$userAddress'
                    },
                    total: {
                        $sum: {
                            $multiply: ['$productId.price', '$quantity']
                        }
                    }
                },
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]).exec()

        console.log(orderItems)

        res.render('seller/manage_orders', {
            layout: 'layouts/layout_seller',
            orderItems
        })
    } catch (error) {
        next(error)
        console.log(error)
    }
}

//API 
async function renderSearchBar(req, res) {
    const product = await Product.find();
    res.send({
        product,
    });
}

async function searchApi(req, res) {
    try {
        // get key
        const key = req.query.key.toLowerCase();
        //get all products corresponding to key
        const products = await Product.find();
        const data = products.filter((value) => {
            return value.name.toLowerCase().includes(key.toLowerCase());
        });
        res.send({
            data,
            key,
        });
    } catch (error) {
        res.status(404).send({
            message: error.message || "Error Occured",
        });
    }
}

async function statistical(req, res) {
    // Start Revenue Statistics
    const orders = await OrderItem.find({
            ordered: true,
        })
        .populate({
            path: "productId",
            model: "Product",
        })
        .exec();

    const total = orders.filter(
        (order) => order.productId.userID == userInfo(req).user_id
    );

    const inDate = orders.filter((order) => {
        return (
            (formatDMY(order.createdAt) == formatDMY(Date.now()) ||
                formatDMY(order.updatedAt) == formatDMY(Date.now())) &&
            order.productId.userID == userInfo(req).user_id
        );
    });

    const between = orders.filter((order) => {
        return (
            formatDMY(order.createdAt) >= formatDMY(req.query.startDate) &&
            formatDMY(order.createdAt) <= formatDMY(req.query.endDate) &&
            order.productId.userID == userInfo(req).user_id
        );
    });

    const totalCost = total.reduce(
        (a, b) => a + b.quantity * b.productId.price,
        0
    );

    const costInDate = inDate.reduce(
        (a, b) => a + b.quantity * b.productId.price,
        0
    );

    const costBetween = between.reduce(
        (a, b) => a + b.quantity * b.productId.price,
        0
    );
    // End Revenue Statistics

    //Start Product statistics

    const products = await Product.find({
        userID: userInfo(req).user_id,
    });

    const alreadySold = total.reduce((a, b) => a + b.quantity, 0);

    const remaining = products.reduce((a, b) => a + b.stock, 0);

    //End Product statistics

    res.render("seller/statistical", {
        layout: "layouts/layout_seller",
        title: "Statistical",
        totalCost,
        costInDate,
        costBetween,
        alreadySold,
        remaining,
    });
}

async function inventoryDetails(req, res) {
    const products = await Product.find({
        userID: userInfo(req).user_id,
    });
    //   const productID = products.map((a) => a._id);

    const orders = await OrderItem.find({
            ordered: true,
        })
        .populate({
            path: "productId",
            model: "Product",
        })
        .exec();

    const total = orders.filter(
        (order) => order.productId.userID == userInfo(req).user_id
    );

    const alreadySold = total.reduce((a, b) => a + b.quantity, 0);

    res.render("seller/inventoryDetails", {
        layout: "layouts/layout_seller",
        title: "Inventory Details",
        products,
        orders,
        alreadySold
    });
}

async function statisticalApi(req, res) {

    // Start Revenue Statistics
    const orders = await OrderItem.find({
        ordered: true,
    }).populate({
        path: 'productId',
        model: 'Product',
    }).exec()

    const date = new Date()
    const months = date.getMonth();
    const dateInMonths = new Date(date.getFullYear(), months, 0).getDate()
    const dayArray = []

    for (let i = 0; i < dateInMonths; i++) {
        let dayIn = `${i + 1}/${months + 1}/${date.getFullYear()}`
        dayArray.push(dayIn)
    }

    const revenuePerDay = dayArray.map(day => {
        let getDay = orders.filter(order => {
            return formatDMY(order.updatedAt) == day && order.productId.userID == userInfo(req).user_id
        })

        let price = getDay.reduce((a, b) => a + b.quantity * b.productId.price, 0)
        return {
            day,
            price,
        }
    })

    const orderPerDay = dayArray.map(day => {
        let getDay = orders.filter(order => {
            return formatDMY(order.updatedAt) == day && order.productId.userID == userInfo(req).user_id
        })
        const order = getDay.reduce((a, b) => a + b.quantity, 0)
        return {
            day,
            order
        }
    })

    // End Revenue Statistics
    res.send({
        revenuePerDay,
        orderPerDay,
    });
}

async function deleteProductApi(req, res) {
    try {
        const orders = await OrderItem.find({
            ordered: true,
        }).populate({
            path: 'productId',
            model: 'Product',
        }).exec()

        res.send({
            orders
        });
    } catch (error) {
        console.log(error)
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
    searchApi,
    manageOrder,
    statistical,
    statisticalApi,
    inventoryDetails,
    deleteProductApi
};