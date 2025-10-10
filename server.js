// PACKAGES
const express = require("express");
const path = require("path");
const {engine} = require("express-handlebars");
const sqlite3 = require("sqlite3");
const session = require("express-session");
const bcrypt = require("bcryptjs");

// VARIABLES AND CONSTANTS
const port = 8080;
const app = express();
app.use(express.urlencoded({extended: false}));
app.use(session({secret: "bjorka", resave: false, saveUninitialized: true}));

const dbFile = "exhibition-data1.sqlite3.db";
const db = new sqlite3.Database(dbFile);
// JSONvariable
const exhibitions = [
  {
    id: 1,
    name: "Light and Shadow",
    location: "Paris, France",
    description:
      "A journey through the interplay of light and darkness in contemporary photography.",
    year: 1998,
    type: "Photography",
    image: "/images/exhibition.jpg",
  },
  {
    id: 2,
    name: "Echoes in Marble",
    location: "Rome, Italy",
    description:
      "Modern sculptors reinterpret classical forms using recycled marble and digital carving.",
    year: 2002,
    type: "Sculpture",
    image: "/images/exhibition2.jpg",
  },
  {
    id: 3,
    name: "Chromatic Dreams",
    location: "Berlin, Germany",
    description:
      "A colorful exhibition exploring emotional responses to chromatic abstraction.",
    year: 2001,
    type: "Painting",
    image: "/images/exhibition3.jpg",
  },
  {
    id: 4,
    name: "Generative Seas",
    location: "Tokyo, Japan",
    description:
      "AI-generated oceanic landscapes exploring the intersection of technology and art.",
    year: 1994,
    type: "Digital Art",
    image: "/images/exhibition4.jpg",
  },
  {
    id: 5,
    name: "Northern Lines",
    location: "Stockholm, Sweden",
    description:
      "Minimalist graphic interpretations of Nordic landscapes in geometry and line.",
    year: 2006,
    type: "Graphic Design",
    image: "/images/exhibition5.jpg",
  },
  {
    id: 6,
    name: "Steel Garden",
    location: "Seoul, South Korea",
    description:
      "Industrial sculptures shaped like organic plants, symbolizing coexistence of nature and steel.",
    year: 2022,
    type: "Installation",
    image: "/images/interior.jpg",
  },
  {
    id: 7,
    name: "Nordic Nature",
    location: "Copenhagen, Denmark",
    description:
      "A fusion of photography and painting capturing Scandinavian wilderness.",
    year: 2017,
    type: "Mixed Media",
    image: "/images/interior.jpg",
  },
  {
    id: 8,
    name: "East Meets West",
    location: "Shanghai, China",
    description:
      "Cross-cultural art dialogue merging Chinese ink and Western oil techniques.",
    year: 2019,
    type: "Painting",
    image: "/images/interior.jpg",
  },
  {
    id: 9,
    name: "Abstract Evolution",
    location: "New York, USA",
    description:
      "Tracing the development of abstract expressionism through the 20th century.",
    year: 1955,
    type: "Painting",
    image: "/images/interior.jpg",
  },
  {
    id: 10,
    name: "Colors of Africa",
    location: "Cape Town, South Africa",
    description:
      "A vibrant exhibition celebrating African identity through color and rhythm.",
    year: 2012,
    type: "Contemporary Art",
    image: "/images/interior.jpg",
  },
];

// MIDDLEWARES
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname));

// expose session to templates
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

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

// Login pages
app.get("/login", (req, res) => {
  res.render("login", {title: "Login"});
});
app.post("/login", (req, res) => {
  const {un, pw} = req.body || {};
  db.get("SELECT * FROM users WHERE username = ?", [un], (err, user) => {
    if (err || !user)
      return res.render("login", {
        title: "Login",
        error: "Invalid credentials",
      });
    const ok = bcrypt.compareSync(pw, user.password_hash);
    if (!ok)
      return res.render("login", {
        title: "Login",
        error: "Invalid credentials",
      });
    req.session.isLoggedIn = true;
    req.session.un = user.username;
    res.redirect("/loginprocess");
  });
});
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/loginprocess"));
});

// Login process page to show status
app.get("/loginprocess", (req, res) => {
  res.render("loginprocess", {
    title: "Login status",
    loggedIn: !!req.session?.isLoggedIn,
    un: req.session?.un,
  });
});

// Exhibitions page
app.get("/exhibitions", (req, res) => {
  db.all("SELECT * FROM exhibitions", (err, rows) => {
    if (err) {
      console.error("Error fetching exhibitions:", err);
      res.status(500).send("Database error");
    } else {
      res.render("exhibitions", {exhibitions: rows});
    }
  });
});

// About page
app.get("/about", (req, res) => {
  res.render("about");
});

// Contact page
app.get("/contact", (req, res) => {
  res.render("contact");
});

// Users table for login
db.run(
  `CREATE TABLE IF NOT EXISTS users (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     username TEXT UNIQUE NOT NULL,
     password_hash TEXT NOT NULL
  )`
);

// Where credentials are embedded: the line below stores the bcrypt hash for "wdf#2025"
const ADMIN_HASH =
  "$2b$10$EIYwU6NE6V.0gAP8zIfVTeApl6DLjjHjN7FkIyArYqRw3N24xH41W";
db.get("SELECT id FROM users WHERE username = ?", ["admin"], (err, row) => {
  if (!row)
    db.run("INSERT INTO users (username, password_hash) VALUES (?, ?)", [
      "admin",
      ADMIN_HASH,
    ]);
});

// LISTEN TO INCOMING REQUESTS
app.listen(port, () =>
  console.log(`Server up and running on http://localhost:${port}...`)
);
