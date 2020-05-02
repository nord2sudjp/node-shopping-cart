var Product = require("../models/product");
var { Cart } = require("../models/cart");
var express = require("express");
var router = express.Router();

var Order = require("../models/order");
var { authwithredirect } = require("../middleware/auth");

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    var products = await Product.find({});
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < products.length; i += chunkSize) {
      productChunks.push(products.slice(i, i + chunkSize));
    }
    var successMsg = req.flash("success")[0];

    res.render("shop/index", {
      title: "Express",
      products: productChunks,
      successMsg,
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

router.get("/checkout", authwithredirect, (req, res, next) => {
  if (!req.session.cart) {
    //return res.render("shop/shopping-cart", { products: null });
    return res.redirect("/shopping-cart");
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash("error")[0];
  res.render("shop/checkout", {
    total: cart.totalPrice,
    errMsg,
    noError: !errMsg,
  });
});

router.post("/checkout", authwithredirect, async (req, res, next) => {
  var token = req.body.stripeToken;

  console.log("[DEBUG] POST /checkout: ", token);
  if (!req.session.cart) {
    //return res.render("shop/shopping-cart", { products: null });
    return res.redirect("/shopping-cart");
  }
  var cart = new Cart(req.session.cart);

  try {
    var stripe = require("stripe")(
      "sk_test_W1VX70xVPncNhD59jZhumIkp00vaIcLdhf"
    );
    console.log("[DEBUG] POST /checkout: creating stripe charge ", token);

    var charge = await stripe.charges.create({
      amount: cart.totalPrice * 100,
      currency: "usd",
      source: token,
      description: "Test charge",
    });
  } catch (e) {
    console.log(e);
    req.flash("error", err.messsage);
    return res.redirect("/checkout");
  }

  try {
    console.log("/checkout", charge);
    var order = new Order({
      user: req.user, // Passportがuserを保管する
      cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id,
    });
    await order.save();
    req.flash(
      "success",
      "Successfully bought product! Order Number : %s",
      order._id
    );
    req.session.cart = null;
    return res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
