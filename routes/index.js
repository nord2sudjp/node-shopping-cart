var Product = require("../models/product");

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    var products = await Product.find({});
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < products.length; i += chunkSize) {
      productChunks.push(products.slice(i, i + chunkSize));
    }
    res.render("shop/index", {
      title: "Express",
      products: productChunks,
    });

    // console.log(products);
  } catch (e) {
    console.log(e);
    res.render("shop/index", { title: "Shopping Cart" });
  }
});

module.exports = router;
