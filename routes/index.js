var express = require("express");
var router = express.Router();
var Product = require("../models/product");
var csrf = require("csurf");
var passport = require("passport");
const { body, check, validationResult } = require("express-validator");

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
  // console.log(req.session);
  // console.log(req.csrfToken());

  var messages = req.flash("error");
  res.render("user/signup", { csrfToken: req.csrfToken(), messages });
  // csrfトークンはどの時点で生成されているのか
  // router.use(csrtToken)でreqにトークンが付加される。
  // ただし毎回tokenは変更される→日付が入っている
});

router.post(
  "/user/signup",
  [
    check("email").notEmpty().withMessage("Email field is required"),
    check("password").notEmpty().withMessage("Password field is required"),
  ],

  /*
  passport.authenticate("local.signup", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/signup",
    failureFlash: true,
  }),
*/
  async (req, res) => {
    // postしたときにcsrfトークンがないとエラーになる。
    // 問題はそのトークン
    // csrtTokenとcsrfSecretの関係

    // console.log(req.session);
    // console.log(req.csrfToken());

    const valresult = validationResult(req);
    if (!valresult.isEmpty()) {
      console.log("/user/signup:", valresult.errors);
      errorMessages = valresult.errors.map((el) => el.msg);
      console.log(errorMessages);
      req.flash("error", errorMessages);
      return res.redirect("/user/signup");
    }
    await passport.authenticate("local.signup", {
      successRedirect: "/user/profile",
      failureRedirect: "/user/signup",
      failureFlash: true,
    })(req, res);
    //res.redirect("/");
  }
);

router.get("/user/profile", (req, res, next) => {
  res.render("user/profile");
});

router.get("/user/signin", (req, res, next) => {
  var messages = req.flash("error");
  res.render("user/signin", { csrfToken: req.csrfToken(), messages });
});

router.post(
  "/user/signin",
  [
    check("email").notEmpty().withMessage("Email field is required"),
    check("password").notEmpty().withMessage("Password field is required"),
  ],
  async (req, res) => {
    const valresult = validationResult(req);

    if (!valresult.isEmpty()) {
      errorMessages = valresult.errors.map((el) => el.msg);
      req.flash("error", errorMessages);
      return res.redirect("/user/signin");
    }
    console.log("/user/signin: main process.");

    await passport.authenticate("local.signin", {
      successRedirect: "/user/profile",
      failureRedirect: "/user/signin",
      failureFlash: true,
    })(req, res);
  }
);

module.exports = router;
