var Product = require("../models/product");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/nodeshoppingcart", {
  useNewUrlParser: true,
  useCreateIndex: true,
});

var products = [
  new Product({
    imagepath:
      "https://upload.wikimedia.org/wikipedia/commons/e/eb/Peeter_Neeffs_%28I%29_-_Interior_of_a_Gothic_Cathedral_-_WGA16479.jpg",
    title: "Gothic video",
    description:
      "Phasellus maximus, sapien ultrices vulputate vulputate, enim tortor posuere magna, id ultrices ante eros a lectus. Fusce eget imperdiet ligula. Proin vitae pharetra lorem.",
    price: 10,
  }),
  new Product({
    imagepath:
      "https://thumbs.dreamstime.com/z/front-interior-gothic-church-front-interior-gothic-church-religion-architecture-cathedral-building-old-catholic-159555329.jpg",
    title: "Lorem ipsum dolor sit amet.",
    description:
      "Nulla volutpat arcu eget orci varius, id molestie quam pharetra. Fusce vel lobortis purus. Praesent id nibh fermentum, ",
    price: 30,
  }),
  new Product({
    imagepath:
      "https://images.unsplash.com/photo-1457038398933-c7f0de7ee615?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80",
    title: "Sed ac imperdiet est. Vivamus",
    description:
      "Donec eget diam non eros blandit finibus. Aenean sed orci dui. Cras sagittis faucibus malesuada. ",
    price: 15,
  }),
  new Product({
    imagepath: "https://picsum.photos/300/200",
    title: "Lorem ipsum dolor sit amet, consectetur",
    description:
      "Nam euismod posuere lacus sit amet maximus. Praesent sed elementum dui. Sed euismod mattis tempus. Aliquam hendrerit ipsum ut ex accumsan lobortis. Cras pellentesque ultricies nulla, ",
    price: 15,
  }),
  new Product({
    imagepath: "https://i.picsum.photos/id/113/300/200.jpg",
    title: "Cras aliquam nisi non faucibus pulvinar.",
    description:
      "Proin consequat libero magna, id pretium lorem malesuada a. Sed ullamcorper odio eu facilisis vestibulum. Ut blandit, augue  ",
    price: 15,
  }),
  new Product({
    imagepath: "https://i.picsum.photos/id/155/300/200.jpg",
    title: "Nulla urna sem, ultrices sed nulla in, euismod consequat lorem.",
    description:
      "uisque bibendum felis non nibh dictum, vestibulum accumsan elit elementum. Curabitur at imperdiet dolor. Maecenas tristique, nunc finibus vestibulum porta, felis nisl tristique urna, at rhoncus urna est ut lectus. Curabitur ac blandit mauris, eget dignissim lectus. Quisque ac ",
    price: 15,
  }),
];

for (var i = 0; i < products.length; i++) {
  products[i].save();
}

//mongoose.disconnect();
