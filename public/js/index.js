"use strict";

var stripe = Stripe("pk_test_5Q2fnCzTlaYEf6NxjotvZdtc00I7b6WbdY");

function registerElements(elements, exampleName) {
  var formClass = "." + exampleName;
  var example = document.querySelector(formClass);
  console.log("registerElements", example);

  var form = example.querySelector("payment-form");
  // var resetButton = example.querySelector("a.reset");
  var error = form.querySelector(".error");
  // var errorMessage = error.querySelector(".message");

  // Listen on the form's 'submit' handler...
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    console.log("submit");

    // Gather additional customer data we may have collected in our form.
    var name = form.querySelector("#" + exampleName + "-name");
    var address1 = form.querySelector("#" + exampleName + "-address");
    var city = form.querySelector("#" + exampleName + "-city");
    var state = form.querySelector("#" + exampleName + "-state");
    var zip = form.querySelector("#" + exampleName + "-zip");
    var additionalData = {
      name: name ? name.value : undefined,
      address_line1: address1 ? address1.value : undefined,
      address_city: city ? city.value : undefined,
      address_state: state ? state.value : undefined,
      address_zip: zip ? zip.value : undefined,
    };

    // Use Stripe.js to create a token. We only need to pass in one Element
    // from the Element group in order to create a token. We can also pass
    // in the additional customer data we collected in our form.
    stripe.createToken(elements[0], additionalData).then(function (result) {
      if (result.token) {
        // If we received a token, show the token ID.
        console.log("submit:token created", result.token.id);

        example.querySelector(".token").value = result.token.id;
      }
    });
    // form.submit();
    // return true;
  });
}
