const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  cart: { type: Object, required: true },
  address: { type: String, required: true },
  name: { type: String, reqiured: true },
  paymentId: { type: String, required: true },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
