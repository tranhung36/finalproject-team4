const Product = require("../models/product.model");
const faker = require("faker");
const slugify = require("slugify");

const productCtrl = {
  getProducts: async (req, res, next) => {
    try {
      let perPage = 12; // số lượng sản phẩm xuất hiện trên 1 page
      let page = req.params.page || 1;

      // Product.find() // find tất cả các data
      //   .skip(perPage * page - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
      //   .limit(perPage)
      //   .exec((err, products) => {
      //     Product.countDocuments((err, count) => {
      //       // đếm để tính xem có bao nhiêu trang
      //       if (err) return next(err);
      //       res.render("products/index", {
      //         products, // sản phẩm trên một page
      //         current: page, // page hiện tại
      //         pages: Math.ceil(count / perPage), // tổng số các page
      //       });
      //     });
      //   });
      let products = await Product.find()
        .skip(perPage * page - perPage)
        .limit(perPage)
        .sort("-price");
      let count = await Product.countDocuments();
      res.render("products/shop", {
        products, // sản phẩm trên một page
        current: page, // page hiện tại
        pages: Math.ceil(count / perPage), // tổng số các page
        count:count // tổng sản phẩm
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  //   addProducts: async (req, res) => {
  //     try {
  //       for (let i = 0; i < 15; i++) {
  //         const product = new Product({
  //           name: faker.commerce.productName(),
  //           slug: slugify(faker.commerce.productName(), {
  //             lower: true,
  //           }),
  //           price: faker.commerce.price(),
  //           description: faker.commerce.productDescription(),
  //           thumbnail: faker.image.image(),
  //         });

  //         product.save((err, data) => {
  //           if (err) {
  //             console.log(err);
  //           }
  //         });
  //       }
  //     } catch (err) {
  //       return res.status(500).json({ msg: err.message });
  //     }
  //   },
};

module.exports = productCtrl;
