const express = require("express");
const router = express.Router();
const {
    redenerManageUser,
    renderManageCoupons,
    renderCreateCoupon,
    createCoupon,
    renderUpdateCoupon,
    updateCoupon,
    deleteCoupon
} = require("../controllers/admin.controller");

//----------- Start Coupon Route
router.get('/manageCoupons', renderManageCoupons)
//Create Coupon
router.get('/manageCoupons/CreateCoupon', renderCreateCoupon)
router.post('/manageCoupons/CreateCoupon', createCoupon)
//Update Coupon
router.get('/manageCoupons/UpdateCoupon/:id', renderUpdateCoupon)
router.put('/manageCoupons/UpdateCoupon/:id', updateCoupon)
//
router.get('/manageCoupons/Deletecoupon/:id', deleteCoupon)
//----------- End Coupon Route


router.get("/", redenerManageUser);



module.exports = router;
