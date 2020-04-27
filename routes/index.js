var express = require("express");
var router = express.Router();
var Product = require("../models/product");
var csrf = require("csurf");

var csrfProtection = csrf();
router.use(csrfProtection); // All of route must be protected by this protection

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

router.get("/user/signup", async (req, res, next) => {
  console.log(req.session);
  console.log(req.csrfToken());
  res.render("user/signup", { csrfToken: req.csrfToken() });
  // csrfトークンはどの時点で生成されているのか
  // router.use(csrtToken)でreqにトークンが付加される。
  // ただし毎回tokenは変更される→日付が入っている
});

router.post("/user/signup", async (req, res, next) => {
  // postしたときにcsrfトークンがないとエラーになる。
  // 問題はそのトークン
  console.log(req.session);
  console.log(req.csrfToken());

  res.redirect("/");
});

module.exports = router;
