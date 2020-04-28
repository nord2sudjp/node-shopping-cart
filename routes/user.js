var express = require("express");
var router = express.Router();

var passport = require("passport");
const { body, check, validationResult } = require("express-validator");

var csrf = require("csurf");
var csrfProtection = csrf();
router.use(csrfProtection); // All of route must be protected by this protection

const { auth, notauth } = require("../middleware/auth");

router.get("/logout", auth, (req, res, next) => {
  req.logout();
  res.redirect("/");
});

router.get("/profile", auth, (req, res, next) => {
  res.render("user/profile");
});

router.use("/", notauth, (req, res, next) => {
  next();
});

router.get("/signup", async (req, res, next) => {
  // console.log(req.session);
  // console.log(req.csrfToken());

  var messages = req.flash("error");
  res.render("user/signup", { csrfToken: req.csrfToken(), messages });
  // csrfトークンはどの時点で生成されているのか
  // router.use(csrtToken)でreqにトークンが付加される。
  // ただし毎回tokenは変更される→日付が入っている
});

router.post(
  "/signup",
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

router.get("/signin", (req, res, next) => {
  var messages = req.flash("error");
  res.render("user/signin", { csrfToken: req.csrfToken(), messages });
});

router.post(
  "/signin",
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

    await passport.authenticate("local.signin", {
      successRedirect: "/user/profile",
      failureRedirect: "/user/signin",
      failureFlash: true,
    })(req, res);
  }
);

module.exports = router;
