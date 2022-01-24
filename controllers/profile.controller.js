const Profile = require("../models/user.model");
const Order = require('../models/order.model')
const userInfo = require('../services/user.service')

async function getProfile(req, res) {
  try {
    const id = req.params.id;
    const user = await Profile.findOne({
      _id: id
    });
    res.render("user", {
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
    }).end();
  } catch (err) {
    return res.json({
      msg: err.message,
    });
  }
}

async function myOrders(req, res, next) {
  try {
    const orders = await Order.find({
      userId: userInfo(req).user_id,
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
            model: 'Category'
          },
        ]
      }
    }).exec()
    res.render('purchase/purchase', {
      orders
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getProfile,
  changeProfile,
  myOrders
};