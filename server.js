// PACKAGES
const express = require("express");
// VARIABLES AND CONSTANTS
const port = 8080;
const app = express();
// MIDDLEWARES
app.use(express.static("public"));
// LISTEN TO INCOMING REQUESTS
app.listen(port, () =>
  console.log(`Server up and running on http://localhost:${port}...`)
);
// LOAD THE HANDLEBARS PACKAGE FOR EXPRESS
const { engine }=require("express-handlebars");
// HANDLEBARS SETTINGS
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
// ROUTE TO RENDER A HANDLEBARS PAGE
app.get("/", (req, res) => {
  res.render('contact')
});