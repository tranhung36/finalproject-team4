const Profile = require("../models/user.model");
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
		const user = await Profile.findOne({
			_id: userId.user_id
		});
		// console.log({user});
		const abc = {
			name: "asdfasf",
			age: 18
		}
		res.render("users/user_profile", {
			user: user,
		});
	} catch (err) {
		return res.status(500).json({
			msg: err.message,
		});
		console.log(err)
	}
}

async function changeProfile(req, res) {
	try {
		//get change input
		const {
			first_name,
			last_name
		} = req.body;

		//filter
		const id = req.params.id;
		const filter = {
			_id: id
		};
		//change
		const update = {
			first_name: first_name,
			last_name: last_name
		};
		console.log(req.body);
		console.log(update);
		//update
		await Profile.findOneAndUpdate(filter, update, {
			new: true
		});
		res.writeHead(303, {
				Location: req.headers.referer,
			})
			.end();
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
			ordered: true
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
			}
		}).exec()

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