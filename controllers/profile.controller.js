const {
	User
} = require("../models/user.model");
const Order = require('../models/order.model')
const Rate = require('../models/rate.model')
const userInfo = require('../services/user.service');
const Product = require("../models/product.model");
const {
	WishList
} = require('../models/user.model')

async function getProfile(req, res) {
	try {
		const userId = userInfo(req)
		const user = await User.findOne({
			_id: userId.user_id
		})

		res.render("users/user_profile", {
			user: user,
		});
	} catch (err) {
		return res.status(500).json({
			msg: err.message,
		});
	}
}

async function changeProfile(req, res) {
	try {
		//get change input
		const {
			first_name,
			last_name,
			address,
			phoneNumber
		} = req.body;

		const user = userInfo(req)
		//filter
		const filter = {
			_id: user.user_id
		};
		//change
		const update = {
			first_name: first_name,
			last_name: last_name,
			address: address,
			phoneNumber: phoneNumber
		}

		const updateProfileUser = await User.findOneAndUpdate(filter, update, {
			upsert: true,
			new: true
		}).exec()
		console.log(updateProfileUser)
		if (updateProfileUser) {
			res.redirect('/user/profile')
		}
	} catch (err) {
		return res.json({
			msg: err.message,
		});
	}
}

async function myOrders(req, res, next) {
	try {
		const user = userInfo(req)
		const orders = await Order.find({
			userId: user.user_id,
			ordered: true,
		}).populate({
			path: 'orderItems',
			populate: {
				path: 'productId',
				model: 'Product',
				populate: [{
						path: 'userID',
						model: 'User'
					},
					{
						path: 'categoryId',
						model: 'ChildCategory'
					},
				]
			},
		}).sort('-createdAt').exec()

		if (orders) {
			res.render('purchase/purchase', {
				orders,
			})
		}
	} catch (error) {
		console.log(error)
	}
}

async function addProductToWish(req, res, next) {
	try {
		let wishList
		const user = userInfo(req)
		const product = await Product.findOne({
			slug: req.params.slug
		})
		wishList = await WishList.findOne({
			product: product._id,
			user: user.user_id,
			wish: false
		})
		if (wishList) {
			wishList.wish = true
			wishList.save()
		} else {
			wishList = await WishList.create({
				product: product._id,
				user: user.user_id,
				wish: true
			})
		}

		res.writeHead(303, {
				Location: req.headers.referer,
			})
			.end()
	} catch (error) {
		console.log(error)
	}
}

async function removeProductFromWishList(req, res) {
	try {
		let wishList
		const user = userInfo(req)
		const product = await Product.findOne({
			slug: req.params.slug
		})
		wishList = await WishList.findOne({
			product: product._id,
			user: user.user_id,
			wish: true
		})
		if (wishList) {
			wishList.wish = false
			wishList.save()
		}
		res.writeHead(303, {
				Location: req.headers.referer,
			})
			.end()
	} catch (error) {
		console.log(error)
	}
}

async function renderProductsWishList(req, res) {
	try {
		const user = userInfo(req)
		const myWishList = await WishList.find({
			user: user.user_id,
			wish: true
		}).populate({
			path: 'product',
			populate: {
				path: 'categoryId',
				model: 'ChildCategory'
			}
		}).exec()
		if (myWishList) {
			res.render('users/wish_list', {
				myWishList
			})
		}
	} catch (error) {
		console.log(error)
	}
}

module.exports = {
	getProfile,
	changeProfile,
	myOrders,
	addProductToWish,
	renderProductsWishList,
	removeProductFromWishList
};