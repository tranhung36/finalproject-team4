const User = require("../models/user.model");
const Coupons = require('../models/coupon.model')
const Category = require('../models/category.model')
const randomCode = require('../utils/randomCode');
const {
  Schema
} = require("mongoose");
const bcrypt = require("bcrypt");

async function renderManageUserPage(req, res) {
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
async function renderCreateUserPage(req, res) {
  res.render("admin/createUserPage");
  ``;
}
async function createUser(req, res) {
  try {
    let email = req.body.email;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let password = req.body.password;
    let role = req.body.role;

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      first_name: firstname,
      last_name: lastname,
      email: email,
      password: encryptedPassword,
      role: role,
    });
    await user.save();
    res.redirect("/admin/manageUsers");
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
}
async function renderUpdateUserPage(req, res) {
  try {
    let id = req.params.id;
    const user = await User.findById({
      _id: id,
    });
    //res.json(user)
    res.render("admin/updateUserPage", {
      user
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
}
async function updateUser(req, res) {
  try {
    let id = req.params.id;
    let role = req.body.role;

    await User.findOneAndUpdate({
      _id: id
    }, {
      role: role
    });
    res.redirect("/admin/manageUsers");
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
}
async function deleteUser(req, res) {
  try {
    let id = req.params.id;
    await User.findByIdAndDelete({
      _id: id,
    });
    res.redirect("/admin/manageUsers");
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
}

//---------- Start Manage Coupons
async function renderManageCoupons(req, res) {
  try {
    const coupons = await Coupons.find();
    res.render('admin/manageCoupons', {
      coupons
    })
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
}

async function renderCreateCoupon(req, res) {
  try {
    const categories = await Category.find()
    res.render('admin/createCoupon', {
      categories
    })
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
}

async function createCoupon(req, res) {
  try {
    const code = randomCode(12)
    const coupon = await Coupons.find({
      code
    })
    let getCategoryName
    if (req.body.byCategory != 0) {
      getCategoryName = await Category.findById({
        _id: req.body.byCategory
      })
    }
    let maxDiscount
    let description = ``
    let byCategory
    if (coupon.length === 0) {
      if (req.body.byCategory == '0') {
        if (req.body.maxDiscount == '') {
          byCategory = null
          maxDiscount = 0
          description = `Up to ${req.body.amount}% on total bill`
        } else {
          byCategory = null
          maxDiscount = req.body.maxDiscount
          description = `Up to ${req.body.amount}% on total bill. Maximum no more than $${req.body.maxDiscount}`
        }
      } else {
        if (req.body.maxDiscount == '') {
          byCategory = req.body.byCategory,
            maxDiscount = 0
          description = `Up to ${req.body.amount}% discount on total bill for category ${getCategoryName.name}`
        } else {
          byCategory = req.body.byCategory,
            maxDiscount = req.body.maxDiscount
          description = `Up to ${req.body.amount}% discount on total bill for category ${getCategoryName.name}. Maximun no more than $${req.body.maxDiscount}`
        }
      }
      const coupon = new Coupons({
        code,
        name: req.body.couponname,
        maxDiscount,
        amount: req.body.amount,
        byCategory,
        description,
        validFrom: req.body.validfrom,
        validTo: req.body.validto,
        active: false
      });
      await coupon.save();
    }

    res.redirect('http://localhost:8080/admin/manageCoupons')
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
}

async function renderUpdateCoupon(req, res) {
  try {
    const coupon = await Coupons.findById(req.params.id);
    if (coupon.byCategory != 0) {
      const category = await Category.find({
        _id: coupon.byCategory
      })
      res.render('admin/updateCoupon', {
        coupon,
        category
      })
    } else {
      const category = 0
      res.render('admin/updateCoupon', {
        coupon,
        category
      })
    }

  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
}

async function updateCoupon(req, res) {
  try {

    const coupon = await Coupons.findById(req.params.id);

    const category = await Category.findById(coupon.byCategory)

    let description = ``
    if (coupon.byCategory == null) {
      categoryName = ''
      if (req.body.byCategory == '0') {
        if (req.body.maxDiscount == 0) {
          description = `Up to ${req.body.amount}% on total bill`
        } else {
          description = `Up to ${req.body.amount}% on total bill. Maximum no more than $${req.body.maxDiscount}`
        }
      }
    } else {
      if (req.body.byCategory != '0') {
        if (req.body.maxDiscount == 0) {
          description = `Up to ${req.body.amount}% discount on total bill for category ${category.name}`
        } else {
          description = `Up to ${req.body.amount}% discount on total bill for category ${category.name}. Maximun no more than $${req.body.maxDiscount}`
        }
      }
    }

    const {
      couponname,
      amount,
      maxDiscount,
      validfrom,
      validto,
      active
    } = req.body
    await Coupons.findOneAndUpdate({
      _id: coupon._id
    }, {
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
    return res.status(500).json({
      msg: err.message
    });
  }
}

async function deleteCoupon(req, res) {
  try {
    await Coupons.findByIdAndDelete(req.params.id)
    res.redirect('http://localhost:8080/admin/manageCoupons')
  } catch (err) {
    return res.status(500).json({
      msg: err.message
    });
  }
}
//---------- End Manage Coupons

module.exports = {
  renderManageCoupons,
  renderCreateCoupon,
  createCoupon,
  renderUpdateCoupon,
  updateCoupon,
  deleteCoupon,
  renderManageUserPage,
  renderUpdateUserPage,
  renderCreateUserPage,
  deleteUser,
  createUser,
  updateUser,
};