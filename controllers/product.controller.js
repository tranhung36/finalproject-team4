const Product = require("../models/product.model");
const {
	ChildCategory
} = require('../models/category.model')
const Rate = require('../models/rate.model')
const userInfo = require('../services/user.service')
const {
	WishList
} = require('../models/user.model')
const decodeJWT = require('jwt-decode')

async function index(req, res, next) {
	try {
		let perPage = 12; // số lượng sản phẩm xuất hiện trên 1 page
		let page = req.query.page || 1;
		let sortType = req.query.show;
		let category = req.query.category

		const url = !sortType ? "/products?" : "/products?show=" + sortType + "&";


		let sortBy = sortType === "priceAsc" ? "price" : sortType === "priceDesc" ? "-price" : ""

		const categoryId = await ChildCategory.findOne({
			slug: category
		})
		let products
		if (categoryId) {
			products = await Product.find({
					categoryId: categoryId._id
				})
				.skip(perPage * page - perPage)
				.limit(perPage)
				.sort(sortBy)
		} else {
			products = await Product.find()
				.skip(perPage * page - perPage)
				.limit(perPage)
				.sort(sortBy)
		}

		let count = await Product.countDocuments();

		let categories = await ChildCategory.aggregate([{
				$group: {
					_id: '$parentCategory',
					category: {
						$first: '$parentCategory'
					},
					subCategory: {
						$push: {
							name: '$name',
							slug: '$slug'
						}
					}
				}
			},
			{
				$lookup: {
					from: 'categories',
					localField: 'category',
					foreignField: '_id',
					as: 'category'
				}
			},
			{
				$unwind: '$category'
			},
			{
				$sort: {
					_id: 1
				}
			}
		]).exec()

		res.render("products/shop", {
			products, // sản phẩm trên một page
			current: page, // page hiện tại
			pages: Math.ceil(count / perPage), // tổng số các page
			count: count, // tổng sản phẩm
			categories, // loại danh mục
			url: url,
		});
	} catch (err) {
		return res.status(500).json({
			msg: err.message,
		});
	}
}

async function show(req, res, next) {
	try {
		const product = await Product.findOne({
			slug: req.params.slug,
		}).populate({
			path: 'categoryId'
		}).populate('userID').exec();

		const rateByUsers = await Rate.find({
			productId: product._id
		}).populate({
			path: 'userId'
		}).exec()

		const productsByCategory = await Product.find({
			categoryId: product.categoryId
		})

		if (!product) {
			return res.render("error", {
				message: "Product not found",
				title: "Not Found",
			});
		}
		let wishProduct
		const accessToken = req.cookies['access_token']
		if (accessToken) {
			const user = decodeJWT(accessToken)
			wishProduct = await WishList.findOne({
				product: product._id,
				user: user.user_id,
			})
		}

		res.render("products/detail", {
			title: "Product",
			product,
			rateByUsers,
			productsByCategory,
			wishProduct
		});
	} catch (error) {
		next(error);
		console.log(error)
	}
}

module.exports = {
	index,
	show,
};