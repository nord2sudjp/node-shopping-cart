var Cart = function (oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = (item, id) => {
    var storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item, qty: 0, price: 0 };
    }
    console.log("Cart:", this.items);
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice += storedItem.item.price;
  };

  this.generateArray = () => {
    var arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
};

module.exports = { Cart };
