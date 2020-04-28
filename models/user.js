var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});
userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = (password, userpassword) => {
  console.log("validPassword: before %s/%s", password, userpassword);
  try {
    var sync = bcrypt.compareSync(password, userpassword);
    console.log("validPassword: after", sync);
    return sync;
  } catch (e) {
    console.log("validPassword: after", sync);
    return false;
  }

  return sync;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
