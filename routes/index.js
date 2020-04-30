var Product = require("../models/product");
var { Cart } = require("../models/cart");
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

router.get("/add-to-cart/:id", async (req, res, next) => {
  var productid = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {}); // Sessionにカートがあればそちらを使う。
  try {
    var product = await Product.findById(productid);
    cart.add(product, product.id);
    req.session.cart = cart; // 作成したcartをsessionに保管
    console.log(
      "/add-to-cart:product added: %s: %s",
      product.id,
      req.session.cart
    );
    res.redirect("/");
  } catch (e) {
    console.log(e);
    return res.redirect("/");
  }
});

router.get("/shopping-cart", (req, res, next) => {
  if (!req.session.cart) {
    return res.render("shop/shopping-cart", { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render("shop/shopping-cart", {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
  });
});

module.exports = router;
