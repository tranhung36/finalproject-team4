const express = require("express");
const router = express.Router();
const {
  getProfile,
  changeProfile,
  addProductToWish,
  removeProductFromWishList,
  renderProductsWishList,
  renderPromotionCodes
} = require('../controllers/profile.controller')
const {
  verifyToken
} = require('../middleware/auth.middleware')

/* GET users profile */
router.get("/profile", getProfile, (err) => {
  console.error(err.message)
  res.status(500).send('Server error')
});

// CHANGE users profile
router.put('/profile/update', changeProfile);

router.get('/add-product-to-wish/:slug', verifyToken, addProductToWish)
router.get('/remove-product-from-wish/:slug', verifyToken, removeProductFromWishList)
router.get('/my-wish-list', verifyToken, renderProductsWishList)
router.get('/promotion-codes', verifyToken, renderPromotionCodes)


module.exports = router;