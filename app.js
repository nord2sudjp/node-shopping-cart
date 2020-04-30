var createError = require("http-errors");
var express = require("express");
var expresssession = require("express-session");

// connect-mongoはここ
var mongostore = require("connect-mongo")(expresssession);

var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var flash = require("connect-flash");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var expresshbs = require("express-handlebars");

var mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");

var app = express();

// Database
require("./db/mongoose");

// view engine setup
// app.engine(".hbs", expresshbs({ defaultLayout: "layout", extname: ".hbs" }));
// こちらだと正しく動かない, #eachで this.titleについて値が取れない
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
require("./config/hbsregister");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  expresssession({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
    store: new mongostore({ mongooseConnection: mongoose.connection }), // mongooseのinitializeが終わってから
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);
app.use(flash());

// express-sessionとpassportの関係性
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

// Routing
app.use((req, res, next) => {
  // always run whichever route.
  // this is necesary to manage view.
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});
app.use("/user", userRouter); // この順番大事。まずはパス付→index→ワイルドカード?
app.use("/", indexRouter);

// catch 404 and forward to error handler
// ここに来るということはパスにマッチしなかった。
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {},
  });
});

module.exports = app;
