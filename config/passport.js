var passport = require("passport");
var User = require("../models/user");
var LocalStrategy = require("passport-local").Strategy;
const { body, check, validationResult } = require("express-validator");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    var user = await User.findById(id);
    done(null, user);
  } catch (e) {
    done(e, null);
  }
});

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      //    async (email, password, done) => {
      console.log("local.signup: %s", email);

      try {
        var user = await User.findOne({ email: email });
        if (user) {
          return done(null, false, { message: "Email is already in use." });
        }
        var newUser = User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        await newUser.save();
        console.log("LocalStrategy: User registration success.");
        return done(null, newUser);
      } catch (e) {
        return done(e, null);
      }
    }
  )
);

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      console.log("local.signin: start %s", email);

      try {
        var user = await User.findOne({ email: email });

        if (!user) {
          return done(null, false, {
            message: "No user found.",
          });
        }

        var validated = await user.validPassword(password, user.password);
        if (!validated) {
          return done(null, false, {
            message: "Password is invalid.",
          });
        }
        console.log("LocalStrategy: local signin : success %s", email);
        return done(null, user);
      } catch (e) {
        return done(e, null);
      }
    }
  )
);
