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