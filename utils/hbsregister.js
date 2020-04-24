var hbs = require("hbs");
var path = require("path");

const partialPath = path.join(__dirname, "../views/partials");
hbs.registerPartials(partialPath);
