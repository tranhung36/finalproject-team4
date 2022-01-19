const User = require("../models/user.model");
const Coupons = require('../models/coupon.model')
const randomCode = require('../utils/randomCode')

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
    res.render('admin/createCoupon')
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

async function createCoupon(req, res) {
  try {
    const code = randomCode(12)
    const coupon = await Coupons.find({ code })

    if (coupon.length === 0) {
      const coupons = new Coupons({
        code,
        name: req.body.couponname,
        maxDiscount: req.body.maxDiscount,
        amount: req.body.amount,
        validFrom: req.body.validfrom,
        validTo: req.body.validto,
        active: false
      });
      console.log(coupons);
      await coupons.save();
    }
    res.redirect('http://localhost:8080/admin/manageCoupons')
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

async function renderUpdateCoupon(req, res) {
  try {
    const coupon = await Coupons.findById(req.params.id);
    // console.log(coupon);
    res.render('admin/updateCoupon', { coupon })
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

async function updateCoupon(req, res) {
  try {
    const {
      couponname,
      amount,
      maxDiscount,
      validfrom,
      validto,
      active
  } = req.body
    await Coupons.findOneAndUpdate({_id: req.params.id}, {
      name: couponname,
      amount: Number(amount),
      maxDiscount,
      validFrom: validfrom,
      validTo: validto,
      active
  })
  res.redirect('http://localhost:8080/admin/manageCoupons/')
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

async function deleteCoupon(req,res) {
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