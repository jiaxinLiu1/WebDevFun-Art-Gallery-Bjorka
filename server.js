// PACKAGES
const express = require("express");
const path = require("path");
const {engine} = require("express-handlebars");

// VARIABLES AND CONSTANTS
const port = 8080;
const app = express();
// JSONvariable
const exhibitions = [
  {
    name: "Impressionist Art",
    description: "Collection of impressionist paintings",
  },
  {
    name: "Modern Sculpture",
    description: "Contemporary sculptures",
  },
];
// MIDDLEWARES
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname));

// HANDLEBARS SETTINGS
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views", "layouts"),
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// ROUTES
app.get("/", (req, res) => {
  res.render("index", {title: "Björka"});
});

// Exhibitions page

app.get("/exhibitions", (req, res) => {
  const model = {exhibitions};
  res.render("exhibitions", model);
});

// About page
app.get("/about", (req, res) => {
  res.render("about");
});

// Contact page
app.get("/contact", (req, res) => {
  res.render("contact");
});

// LISTEN TO INCOMING REQUESTS
app.listen(port, () =>
  console.log(`Server up and running on http://localhost:${port}...`)
);
