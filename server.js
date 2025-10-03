// PACKAGES
const express = require("express");
const path = require("path");
const {engine} = require("express-handlebars");
const sqlite3 = require("sqlite3");

// VARIABLES AND CONSTANTS
const port = 8080;
const app = express();
const dbFile = "exhibition-data1.sqlite3.db";
db = new sqlite3.Database(dbFile);
// JSONvariable
const exhibitions = [
  {
    id: "1",
    name: "Impressionist Art",
    description: "Collection of impressionist paintings",
  },
  {id: "2", name: "Modern Sculpture", description: "Contemporary sculptures"},
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

//create the "exhibition"table to the database
db.run(
  `CREATE TABLE skills (
     sid INTEGER PRIMARY KEY AUTOINCREMENT,
     sname TEXT NOT NULL,
     sdesc TEXT NOT NULL,
     stype TEXT NOT NULL,
     slevel INT
  )`,
  (error) => {
    if (error) {
      console.log("ERROR: ", error);
    } else {
      console.log("Exhibitions table created successfully!");
      //inserts exhibitions
      exhibitions.forEach((oneExhibition) => {
        db.run`INSERT INTO exhibitions (name, description) VALUES (?, ?)`,
          [oneExhibition.name, oneExhibition.description],
          (err) => {
            if (err) {
              console.log("ERROR inserting exhibition: ", err);
            } else {
              console.log(`Inserted exhibition: ${oneExhibition.name}`);
            }
          };
      });
    }
  }
);

// LISTEN TO INCOMING REQUESTS
app.listen(port, () =>
  console.log(`Server up and running on http://localhost:${port}...`)
);
