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

// DATABASE table1-exhibition
function initTableExhibitions(mydb) {
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

  //create table-1(exhibition) and insert data at startup
  mydb.run(
    `
CREATE TABLE IF NOT EXISTS exhibitions (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  year INTEGER NOT NULL,
  type TEXT NOT NULL,
  image_url TEXT
)`,
    (error) => {
      if (error) {
        console.log("Error creating table:", error);
      } else {
        console.log("Table exhibitions created successfully!");

        // remove old data
        mydb.run("DELETE FROM exhibitions", [], (err) => {
          if (err) {
            console.log("Error clearing table:", err);
            return;
          } else {
            console.log("Old exhibitions deleted");
          }
          //create new data
          exhibitions.forEach((ex) => {
            mydb.run(
              "INSERT INTO exhibitions (id, name, location, description, year, type, image_url) VALUES (?, ?, ?, ?, ?, ?,?)",
              [
                ex.id,
                ex.name,
                ex.location,
                ex.description,
                ex.year,
                ex.type,
                ex.image_url,
              ],
              (err) => {
                if (err) {
                  console.log("Error inserting record:", err);
                } else {
                  console.log("Added exhibition:", ex.name);
                }
              }
            );
          });
        });
      }
    }
  );
}

// DATABASE table2-artists
function initTableArtists(mydb) {
  const artists = [
    {
      exhibition_id: 1,
      name: "Alice Dupont",
      nationality: "France",
      age: 34,
      famous_work: "Light Shadows",
      image_url: "/images/artists/alice.jpg",
    },
    {
      exhibition_id: 1,
      name: "Jean Moreau",
      nationality: "France",
      age: 41,
      famous_work: "Dark Lines",
      image_url: "/images/artists/jean.jpg",
    },
    {
      exhibition_id: 1,
      name: "Camille Petit",
      nationality: "France",
      age: 29,
      famous_work: "Shadow Play",
      image_url: "/images/artists/camille.jpg",
    },
    {
      exhibition_id: 2,
      name: "Luca Rossi",
      nationality: "Italy",
      age: 39,
      famous_work: "Echoes Sculpture",
      image_url: "/images/artists/luca.jpg",
    },
    {
      exhibition_id: 2,
      name: "Maria Bianchi",
      nationality: "Italy",
      age: 32,
      famous_work: "Marble Whispers",
      image_url: "/images/artists/maria.jpg",
    },
    {
      exhibition_id: 2,
      name: "Giovanni Conti",
      nationality: "Italy",
      age: 45,
      famous_work: "Stone Flow",
      image_url: "/images/artists/giovanni.jpg",
    },
    {
      exhibition_id: 3,
      name: "Klaus Becker",
      nationality: "Germany",
      age: 45,
      famous_work: "Chromatic Dreams Series",
      image_url: "/images/artists/klaus.jpg",
    },
    {
      exhibition_id: 3,
      name: "Sophie Müller",
      nationality: "Germany",
      age: 28,
      famous_work: "Color Emotion",
      image_url: "/images/artists/sophie.jpg",
    },
    {
      exhibition_id: 3,
      name: "Maximilian Weber",
      nationality: "Germany",
      age: 38,
      famous_work: "Abstract Emotion",
      image_url: "/images/artists/maximilian.jpg",
    },
    {
      exhibition_id: 4,
      name: "Hiroshi Tanaka",
      nationality: "Japan",
      age: 37,
      famous_work: "Generative Sea Waves",
      image_url: "/images/artists/hiroshi.jpg",
    },
    {
      exhibition_id: 4,
      name: "Yuki Nakamura",
      nationality: "Japan",
      age: 31,
      famous_work: "AI Ocean",
      image_url: "/images/artists/yuki.jpg",
    },
    {
      exhibition_id: 4,
      name: "Takumi Saito",
      nationality: "Japan",
      age: 40,
      famous_work: "Digital Tide",
      image_url: "/images/artists/takumi.jpg",
    },
    {
      exhibition_id: 5,
      name: "Erik Svensson",
      nationality: "Sweden",
      age: 42,
      famous_work: "Northern Lines Prints",
      image_url: "/images/artists/erik.jpg",
    },
    {
      exhibition_id: 5,
      name: "Astrid Lindgren",
      nationality: "Sweden",
      age: 35,
      famous_work: "Nordic Geometry",
      image_url: "/images/artists/astrid.jpg",
    },
    {
      exhibition_id: 5,
      name: "Bjorn Karlsson",
      nationality: "Sweden",
      age: 47,
      famous_work: "Minimalist Lines",
      image_url: "/images/artists/bjorn.jpg",
    },
    {
      exhibition_id: 6,
      name: "Ji-hoon Park",
      nationality: "South Korea",
      age: 36,
      famous_work: "Steel Garden Installation",
      image_url: "/images/artists/jihoon.jpg",
    },
    {
      exhibition_id: 6,
      name: "Min-seo Kim",
      nationality: "South Korea",
      age: 30,
      famous_work: "Industrial Nature",
      image_url: "/images/artists/minseo.jpg",
    },
    {
      exhibition_id: 6,
      name: "Hye-jin Lee",
      nationality: "South Korea",
      age: 33,
      famous_work: "Organic Steel",
      image_url: "/images/artists/hyejin.jpg",
    },
    {
      exhibition_id: 7,
      name: "Lars Jensen",
      nationality: "Denmark",
      age: 50,
      famous_work: "Nordic Nature Fusion",
      image_url: "/images/artists/lars.jpg",
    },
    {
      exhibition_id: 7,
      name: "Freja Nielsen",
      nationality: "Denmark",
      age: 29,
      famous_work: "Scandinavian Wilderness",
      image_url: "/images/artists/freja.jpg",
    },
    {
      exhibition_id: 8,
      name: "Chen Wei",
      nationality: "China",
      age: 35,
      famous_work: "East Meets West",
      image_url: "/images/artists/chen.jpg",
    },
    {
      exhibition_id: 8,
      name: "Li Na",
      nationality: "China",
      age: 32,
      famous_work: "Ink & Oil Fusion",
      image_url: "/images/artists/lina.jpg",
    },
    {
      exhibition_id: 9,
      name: "John Smith",
      nationality: "USA",
      age: 48,
      famous_work: "Abstract Evolution",
      image_url: "/images/artists/john.jpg",
    },
    {
      exhibition_id: 9,
      name: "Emily Johnson",
      nationality: "USA",
      age: 38,
      famous_work: "Modern Abstract",
      image_url: "/images/artists/emily.jpg",
    },
    {
      exhibition_id: 10,
      name: "Thabo Mbeki",
      nationality: "South Africa",
      age: 41,
      famous_work: "Colors of Africa",
      image_url: "/images/artists/thabo.jpg",
    },
    {
      exhibition_id: 10,
      name: "Ayesha Dlamini",
      nationality: "South Africa",
      age: 33,
      famous_work: "African Rhythm",
      image_url: "/images/artists/ayesha.jpg",
    },
  ];

  //create table-2(artists) and insert data at startup
  mydb.run(
    `
CREATE TABLE IF NOT EXISTS artists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exhibition_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  nationality TEXT,
  age INTEGER,
  famous_work TEXT,
  image_url TEXT
)
`,
    (error) => {
      if (error) {
        console.log("Error creating table:", error);
      } else {
        console.log("Table exhibitions created successfully!");

        // remove old data
        mydb.run("DELETE FROM artists", [], (err) => {
          if (err) {
            console.log("Error clearing table:", err);
            return;
          } else {
            console.log("Old artists deleted");
          }
          //create new data
          artists.forEach((ex) => {
            mydb.run(
              "INSERT INTO artists (exhibition_id, name, nationality, age, famous_work, image_url) VALUES (?, ?, ?, ?, ?, ?)",
              [
                ex.exhibition_id,
                ex.name,
                ex.nationality,
                ex.age,
                ex.famous_work,
                ex.image,
              ],
              (err) => {
                if (err) {
                  console.log("Error inserting record:", err);
                } else {
                  console.log("Added artists:", ex.name);
                }
              }
            );
          });
        });
      }
    }
  );
}

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
  db.all("SELECT * FROM exhibitions ORDER BY id ASC", [], (err, rows) => {
    if (err) return res.send("Database error");
    res.render("exhibitions", {exhibitions: rows});
  });
});
//Exhibition details page
app.get("/exhibition/:id", (req, res) => {
  const exId = req.params.id;

  // search the exhibition
  db.get(
    "SELECT * FROM exhibitions WHERE id = ?",
    [exId],
    (err, exhibition) => {
      if (err || !exhibition) return res.send("Exhibition not found");

      // search the artists of the exhibition
      db.all(
        "SELECT * FROM artists WHERE exhibition_id = ?",
        [exId],
        (err2, artists) => {
          if (err2) return res.send("Error loading artists");

          //
          res.render("exhibition-details", {
            exhibition,
            artists,
          });
        }
      );
    }
  );
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
app.listen(port, function () {
  initTableExhibitions(db);
  initTableArtists(db);
  console.log("Server is listening on port " + port + "...");
});
