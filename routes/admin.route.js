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
    showCategories,
    createCategory,
    updateCategory,
    renderCreateCategory,
    renderUpdateCategory
} = require("../controllers/admin.controller");

//----------- Start Coupon Route
router.get('/manage-coupons', renderManageCoupons)
//Create Coupon
router.get('/manage-coupons/create-coupon', renderCreateCoupon)
router.post('/manage-coupons/create-coupon', createCoupon)
//Update Coupon
router.get('/manage-coupons/update-coupon/:id', renderUpdateCoupon)
router.put('/manage-coupons/update-coupon/:id', updateCoupon)
//
router.get('/manage-coupons/delete-coupon/:id', deleteCoupon)
//----------- End Coupon Route

router.get("/manageUsers", renderManageUserPage);

router.get("/manageUsers/createUser", renderCreateUserPage);
router.post("/manageUsers/createUser", createUser);

router.get("/manageUsers/updateUser/:id", renderUpdateUserPage);
router.put("/manageUsers/updateUser/:id", updateUser);

router.get("/manageUsers/deleteUser/:id", deleteUser);

//-------- Manage Categories
router.get('/manage/categories', showCategories)
router.get('/manage/categories/create', renderCreateCategory)
router.post('/manage/categories', createCategory)

router.get('/manage/categories/update', renderUpdateCategory)
router.put("/manage/categories/update/:id", updateCategory);

router.get("/", renderManageUserPage);


module.exports = router;