(function () {
  "use strict";
  var elements = stripe.elements({
    locale: "auto",
  });

  var card = elements.create("card");
  card.mount("#example1-card");

  registerElements([card], "example1");
})();
