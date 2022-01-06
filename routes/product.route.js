const express = require("express");
const router = express.Router();
const productCtrl = require("../controllers/product.controller");
/* GET home page. */
// router.get('/', function (req, res, next) {
//     res.render('products/shop', {
//         title: 'Shop',
//     });
// });

/* GET Products*/
router.get("/shop/:page", productCtrl.getProducts);

module.exports = router;
