// PACKAGES
const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const sqlite3 = require("sqlite3");
const session = require("express-session");
const bcrypt = require("bcryptjs");

// VARIABLES AND CONSTANTS
const port = 8080;
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: "bjorka", resave: false, saveUninitialized: true }));

const dbFile = "exhibition-data1.sqlite3.db";
const db = new sqlite3.Database(dbFile);
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

// expose session to templates
app.use((req, res, next) => { res.locals.session = req.session; next(); });

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
  res.render("login", { title: "Login" });
});
app.post("/login", (req, res) => {
  const { un, pw } = req.body || {};
  db.get("SELECT * FROM users WHERE username = ?", [un], (err, user) => {
    if (err || !user) return res.render("login", { title: "Login", error: "Invalid credentials" });
    const ok = bcrypt.compareSync(pw, user.password_hash);
    if (!ok) return res.render("login", { title: "Login", error: "Invalid credentials" });
    req.session.isLoggedIn = true;
    req.session.un = user.username;
    res.redirect("/loginprocess");
  });
});
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/loginprocess"));
});

// Login process page to show status
app.get('/loginprocess', (req, res) => {
  res.render('loginprocess', { title: 'Login status', loggedIn: !!req.session?.isLoggedIn, un: req.session?.un });
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

// Users table for login
db.run(
  `CREATE TABLE IF NOT EXISTS users (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     username TEXT UNIQUE NOT NULL,
     password_hash TEXT NOT NULL
  )`
);

// Where credentials are embedded: the line below stores the bcrypt hash for "wdf#2025"
const ADMIN_HASH = "$2b$10$EIYwU6NE6V.0gAP8zIfVTeApl6DLjjHjN7FkIyArYqRw3N24xH41W";
db.get("SELECT id FROM users WHERE username = ?", ["admin"], (err, row) => {
  if (!row) db.run("INSERT INTO users (username, password_hash) VALUES (?, ?)", ["admin", ADMIN_HASH]);
});

// LISTEN TO INCOMING REQUESTS
app.listen(port, () =>
  console.log(`Server up and running on http://localhost:${port}...`)
);