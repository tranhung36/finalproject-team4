const User = require("../models/user.model");
const Coupons = require('../models/coupon.model')
const Category = require('../models/category.model')
const randomCode = require('../utils/randomCode');
const { Schema } = require("mongoose");

async function redenerManageUser(req, res) {
  try {
    let userInfo = await User.find();

    res.render("admin/ManageUserPage", {
      userInfo,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
}

// Start Manage Coupons
async function renderManageCoupons(req, res) {
  try {
    const coupons = await Coupons.find();
    res.render('admin/manageCoupons', { coupons })
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

async function renderCreateCoupon(req, res) {
  try {
    const categories = await Category.find()
    res.render('admin/createCoupon', { categories })
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

async function createCoupon(req, res) {
  try {
    const code = randomCode(12)
    const coupon = await Coupons.find({ code })
    let getCategoryName
    if (req.body.byCategory != 0) {
      getCategoryName = await Category.findById({ _id: req.body.byCategory })
    }
    if (coupon.length === 0) {
      if (req.body.byCategory == '0') {
        if (req.body.maxDiscount == '') {
          const coupon = new Coupons({
            code,
            name: req.body.couponname,
            amount: req.body.amount,
            maxDiscount: 0,
            byCategory: req.body.byCategory,
            description: `Up to ${req.body.amount}% on total bill`,
            validFrom: req.body.validfrom,
            validTo: req.body.validto,
            active: false
          });
          await coupon.save();
        } else {
          const coupon = new Coupons({
            code,
            name: req.body.couponname,
            maxDiscount: req.body.maxDiscount,
            amount: req.body.amount,
            byCategory: req.body.byCategory,
            description: `Up to ${req.body.amount}% on total bill. Maximum no more than $${req.body.maxDiscount}`,
            validFrom: req.body.validfrom,
            validTo: req.body.validto,
            active: true
          });
          await coupon.save();
        }
      } else {
        if (req.body.maxDiscount == '') {
          const coupon = new Coupons({
            code,
            name: req.body.couponname,
            amount: req.body.amount,
            maxDiscount: 0,
            byCategory: req.body.byCategory,
            description: `Up to ${req.body.amount}% discount on total bill for category ${getCategoryName.name}`,
            validFrom: req.body.validfrom,
            validTo: req.body.validto,
            active: false
          });
          await coupon.save();
        } else {
          const coupon = new Coupons({
            code,
            name: req.body.couponname,
            maxDiscount: req.body.maxDiscount,
            amount: req.body.amount,
            byCategory: req.body.byCategory,
            description: `Up to ${req.body.amount}% discount on total bill for category ${getCategoryName.name}. Maximun no more than $${req.body.maxDiscount}`,
            validFrom: req.body.validfrom,
            validTo: req.body.validto,
            active: false
          });
          await coupon.save();
        }
      }
    }

    // res.redirect('http://localhost:8080/admin/manageCoupons')
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

async function renderUpdateCoupon(req, res) {
  try {
    const coupon = await Coupons.findById(req.params.id);
    console.log(coupon.byCategory);
    if (coupon.byCategory != 0) {
      const category = await Category.find({ _id: coupon.byCategory })
      res.render('admin/updateCoupon', { coupon, category })
    } else {
      const category = 0
      res.render('admin/updateCoupon', { coupon, category })
    }

  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

async function updateCoupon(req, res) {
  try {

    const coupon = await Coupons.findById(req.params.id);
    const category = await Category.findById(coupon.byCategory)
    let description = ``
    if (coupon.byCategory == 0) {
      categoryName = ''
      if (req.body.byCategory == '0') {
        if (req.body.maxDiscount == '0') {
          description = `Up to ${req.body.amount}% on total bill`
        } else {
          description = `Up to ${req.body.amount}% on total bill. Maximum no more than $${req.body.maxDiscount}`
        }
      } 
    } else {
      if (req.body.byCategory != '0') {
        if (req.body.maxDiscount == '0') {
          description = `Up to ${req.body.amount}% discount on total bill for category ${category.name}`
        } else {
          description = `Up to ${req.body.amount}% discount on total bill for category ${category.name}. Maximun no more than $${req.body.maxDiscount}`
        }
      }
    }
    const { couponname, amount, maxDiscount, validfrom, validto, active } = req.body
    await Coupons.findOneAndUpdate({ _id: coupon._id }, {
      name: couponname,
      amount: Number(amount),
      maxDiscount,
      validFrom: validfrom,
      validTo: validto,
      active,
      description
    })
    res.redirect('http://localhost:8080/admin/manageCoupons/')

  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

async function deleteCoupon(req, res) {
  try {
    await Coupons.findByIdAndDelete(req.params.id)
    res.redirect('http://localhost:8080/admin/manageCoupons')
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}
// End Manage Coupons

module.exports = {
  redenerManageUser,
  renderManageCoupons,
  renderCreateCoupon,
  createCoupon,
  renderUpdateCoupon,
  updateCoupon,
  deleteCoupon
};