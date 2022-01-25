const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/admin.controller");

//----------- Start Coupon Route
router.get('/manage/coupons', renderManageCoupons)
//Create Coupon
router.get('/manage/coupons/create', renderCreateCoupon)
router.post('/manage/coupons/create', createCoupon)
//Update Coupon
router.get('/manage/coupons/update/:id', renderUpdateCoupon)
router.put('/manage/coupons/update/:id', updateCoupon)
//
router.get('/manage/coupons/delete/:id', deleteCoupon)
//----------- End Coupon Route

router.get("/manage/users", renderManageUserPage);

router.get("/manage/users/create", renderCreateUserPage);
router.post("/manage/users/create", createUser);

router.get("/manage/users/update/:id", renderUpdateUserPage);
router.put("/manage/users/update/:id", updateUser);

router.get("/manage/users/delete/:id", deleteUser);

router.get("/", renderManageUserPage);


module.exports = router;