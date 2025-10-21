/*
Jiaxin Liu - liji23zn@student.ju.se
Yuhong Jiang - jiyu24ln@student.ju.se

Target grade: 5

Project Web Dev Fun - 2025

Administrator login: admin
Administrator password: "wdf#2025" ---> "$2b$10$EIYwU6NE6V.0gAP8zIfVTeApl6DLjjHjN7FkIyArYqRw3N24xH41W"

- Some code in this project where generated with the help of ChatGPT
- Several images and videos come from the web (not made by us): pexels.com,pinterest.com

*/

// PACKAGES
const express = require("express");
const path = require("path");
const {engine} = require("express-handlebars");
const sqlite3 = require("sqlite3");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const multer = require("multer");

// VARIABLES AND CONSTANTS
const port = 8080;
const app = express();
app.use(express.urlencoded({extended: false}));
app.use(session({secret: "bjorka", resave: false, saveUninitialized: true}));

const dbFile = "exhibition-data1.sqlite3.db";
const db = new sqlite3.Database(dbFile);

// Multer configuration: save uploads into public/images
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "public", "images")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const name =
      "upload-" + Date.now() + "-" + Math.round(Math.random() * 1e6) + ext;
    cb(null, name);
  },
});
const upload = multer({storage});

// DATABASE table1-exhibition
function initTableExhibitions(mydb) {
  const exhibitions = [
    {
      id: 1,
      name: "Light and Shadow",
      location: "Paris, France",
      description:
        "A journey through the interplay of light and darkness in contemporary photography.",
      year: 2023,
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
      year: 2021,
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
      image: "/images/exhibition6.jpg",
    },
    {
      id: 7,
      name: "Nordic Nature",
      location: "Copenhagen, Denmark",
      description:
        "A fusion of photography and painting capturing Scandinavian wilderness.",
      year: 2017,
      type: "Mixed Media",
      image: "/images/exhibition7.jpg",
    },
    {
      id: 8,
      name: "East Meets West",
      location: "Shanghai, China",
      description:
        "Cross-cultural art dialogue merging Chinese ink and Western oil techniques.",
      year: 2019,
      type: "Painting",
      image: "/images/exhibition8.jpg",
    },
    {
      id: 9,
      name: "Abstract Evolution",
      location: "New York, USA",
      description:
        "Tracing the development of abstract expressionism through the 20th century.",
      year: 2018,
      type: "Painting",
      image: "/images/exhibition9.jpg",
    },
    {
      id: 10,
      name: "Colors of Africa",
      location: "Cape Town, South Africa",
      description:
        "A vibrant exhibition celebrating African identity through color and rhythm.",
      year: 2012,
      type: "Contemporary Art",
      image: "/images/exhibition10.jpg",
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
          //create new data，insert each exhibition into the table
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
                ex.image,
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
      image_url: "/images/artist1.jpg",
    },
    {
      exhibition_id: 1,
      name: "Jean Moreau",
      nationality: "France",
      age: 41,
      famous_work: "Dark Lines",
      image_url: "/images/artist2.jpg",
    },
    {
      exhibition_id: 1,
      name: "Camille Petit",
      nationality: "France",
      age: 29,
      famous_work: "Shadow Play",
      image_url: "/images/artist3.jpg",
    },
    {
      exhibition_id: 2,
      name: "Luca Rossi",
      nationality: "Italy",
      age: 39,
      famous_work: "Echoes Sculpture",
      image_url: "/images/artist4.jpg",
    },
    {
      exhibition_id: 2,
      name: "Maria Bianchi",
      nationality: "Italy",
      age: 32,
      famous_work: "Marble Whispers",
      image_url: "/images/artist5.jpg",
    },
    {
      exhibition_id: 2,
      name: "Giovanni Conti",
      nationality: "Italy",
      age: 45,
      famous_work: "Stone Flow",
      image_url: "/images/artist6.jpg",
    },
    {
      exhibition_id: 3,
      name: "Klaus Becker",
      nationality: "Germany",
      age: 45,
      famous_work: "Chromatic Dreams Series",
      image_url: "/images/artist7.jpg",
    },
    {
      exhibition_id: 3,
      name: "Sophie Müller",
      nationality: "Germany",
      age: 28,
      famous_work: "Color Emotion",
      image_url: "/images/artist8.jpg",
    },
    {
      exhibition_id: 3,
      name: "Maximilian Weber",
      nationality: "Germany",
      age: 38,
      famous_work: "Abstract Emotion",
      image_url: "/images/artist9.jpg",
    },
    {
      exhibition_id: 4,
      name: "Hiroshi Tanaka",
      nationality: "Japan",
      age: 37,
      famous_work: "Generative Sea Waves",
      image_url: "/images/artist10.jpg",
    },
    {
      exhibition_id: 4,
      name: "Yuki Nakamura",
      nationality: "Japan",
      age: 31,
      famous_work: "AI Ocean",
      image_url: "/images/artist11.jpg",
    },
    {
      exhibition_id: 4,
      name: "Takumi Saito",
      nationality: "Japan",
      age: 40,
      famous_work: "Digital Tide",
      image_url: "/images/artist12.jpg",
    },
    {
      exhibition_id: 5,
      name: "Erik Svensson",
      nationality: "Sweden",
      age: 42,
      famous_work: "Northern Lines Prints",
      image_url: "/images/artist13.jpg",
    },
    {
      exhibition_id: 5,
      name: "Astrid Lindgren",
      nationality: "Sweden",
      age: 35,
      famous_work: "Nordic Geometry",
      image_url: "/images/artist14.jpg",
    },
    {
      exhibition_id: 5,
      name: "Bjorn Karlsson",
      nationality: "Sweden",
      age: 47,
      famous_work: "Minimalist Lines",
      image_url: "/images/artist15.jpg",
    },
    {
      exhibition_id: 6,
      name: "Ji-hoon Park",
      nationality: "South Korea",
      age: 36,
      famous_work: "Steel Garden Installation",
      image_url: "/images/artist16.jpg",
    },
    {
      exhibition_id: 6,
      name: "Min-seo Kim",
      nationality: "South Korea",
      age: 30,
      famous_work: "Industrial Nature",
      image_url: "/images/artist17.jpg",
    },
    {
      exhibition_id: 6,
      name: "Hye-jin Lee",
      nationality: "South Korea",
      age: 33,
      famous_work: "Organic Steel",
      image_url: "/images/artist2.jpg",
    },
    {
      exhibition_id: 7,
      name: "Lars Jensen",
      nationality: "Denmark",
      age: 50,
      famous_work: "Nordic Nature Fusion",
      image_url: "/images/artist3.jpg",
    },
    {
      exhibition_id: 7,
      name: "Freja Nielsen",
      nationality: "Denmark",
      age: 29,
      famous_work: "Scandinavian Wilderness",
      image_url: "/images/artist4.jpg",
    },
    {
      exhibition_id: 8,
      name: "Chen Wei",
      nationality: "China",
      age: 35,
      famous_work: "East Meets West",
      image_url: "/images/artist5.jpg",
    },
    {
      exhibition_id: 8,
      name: "Li Na",
      nationality: "China",
      age: 32,
      famous_work: "Ink & Oil Fusion",
      image_url: "/images/artist6.jpg",
    },
    {
      exhibition_id: 9,
      name: "John Smith",
      nationality: "USA",
      age: 48,
      famous_work: "Abstract Evolution",
      image_url: "/images/artist7.jpg",
    },
    {
      exhibition_id: 9,
      name: "Emily Johnson",
      nationality: "USA",
      age: 38,
      famous_work: "Modern Abstract",
      image_url: "/images/artist8.jpg",
    },
    {
      exhibition_id: 10,
      name: "Thabo Mbeki",
      nationality: "South Africa",
      age: 41,
      famous_work: "Colors of Africa",
      image_url: "/images/artist9.jpg",
    },
    {
      exhibition_id: 10,
      name: "Ayesha Dlamini",
      nationality: "South Africa",
      age: 33,
      famous_work: "African Rhythm",
      image_url: "/images/artist10.jpg",
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
        console.log("Table artists created successfully!");

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
                ex.image_url,
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
// DATABASE table3-artworks
function initTableArtworks(mydb) {
  const artworks = [
    {
      exhibition_id: 1,
      title: "Light Shadows",
      rewords: "Exploring interplay of light and darkness",
      medium: "Photography",
    },
    {
      exhibition_id: 1,
      title: "Dark Lines",
      rewords: "Contrast between shadow and line",
      medium: "Photography",
    },
    {
      exhibition_id: 1,
      title: "Shadow Play",
      rewords: "Play of light and shadow in abstract forms",
      medium: "Photography",
    },

    {
      exhibition_id: 2,
      title: "Echoes Sculpture",
      rewords: "Modern reinterpretation of classical sculpture",
      medium: "Marble Sculpture",
    },
    {
      exhibition_id: 2,
      title: "Marble Whispers",
      rewords: "Delicate marble carving emphasizing echoes of past",
      medium: "Marble Sculpture",
    },
    {
      exhibition_id: 2,
      title: "Stone Flow",
      rewords: "Fluid movement in solid material",
      medium: "Marble Sculpture",
    },

    {
      exhibition_id: 3,
      title: "Chromatic Dreams Series",
      rewords: "Emotional exploration through colors",
      medium: "Painting",
    },
    {
      exhibition_id: 3,
      title: "Color Emotion",
      rewords: "Abstract color patterns evoke feelings",
      medium: "Painting",
    },
    {
      exhibition_id: 3,
      title: "Abstract Emotion",
      rewords: "Emotional abstraction through paint",
      medium: "Painting",
    },

    {
      exhibition_id: 4,
      title: "Generative Sea Waves",
      rewords: "AI-generated oceanic patterns",
      medium: "Digital Art",
    },
    {
      exhibition_id: 4,
      title: "AI Ocean",
      rewords: "Artificial intelligence simulates ocean aesthetics",
      medium: "Digital Art",
    },
    {
      exhibition_id: 4,
      title: "Digital Tide",
      rewords: "Dynamic digital visualization of tides",
      medium: "Digital Art",
    },

    {
      exhibition_id: 5,
      title: "Northern Lines Prints",
      rewords: "Minimalist geometric Nordic landscapes",
      medium: "Graphic Design",
    },
    {
      exhibition_id: 5,
      title: "Nordic Geometry",
      rewords: "Geometry-inspired representations of nature",
      medium: "Graphic Design",
    },
    {
      exhibition_id: 5,
      title: "Minimalist Lines",
      rewords: "Minimalist approach to Nordic scenery",
      medium: "Graphic Design",
    },

    {
      exhibition_id: 6,
      title: "Steel Garden Installation",
      rewords: "Industrial sculpture representing organic forms",
      medium: "Installation",
    },
    {
      exhibition_id: 6,
      title: "Industrial Nature",
      rewords: "Fusion of steel and natural shapes",
      medium: "Installation",
    },
    {
      exhibition_id: 6,
      title: "Organic Steel",
      rewords: "Steel works resembling plants",
      medium: "Installation",
    },

    {
      exhibition_id: 7,
      title: "Nordic Nature Fusion",
      rewords: "Combination of photography and painting",
      medium: "Mixed Media",
    },
    {
      exhibition_id: 7,
      title: "Scandinavian Wilderness",
      rewords: "Capturing the essence of Scandinavian landscapes",
      medium: "Mixed Media",
    },

    {
      exhibition_id: 8,
      title: "East Meets West",
      rewords: "Cross-cultural integration of ink and oil",
      medium: "Painting",
    },
    {
      exhibition_id: 8,
      title: "Ink & Oil Fusion",
      rewords: "Blending Chinese ink and Western oil techniques",
      medium: "Painting",
    },

    {
      exhibition_id: 9,
      title: "Abstract Evolution",
      rewords: "Tracing abstract expressionism development",
      medium: "Painting",
    },
    {
      exhibition_id: 9,
      title: "Modern Abstract",
      rewords: "Contemporary abstract techniques",
      medium: "Painting",
    },

    {
      exhibition_id: 10,
      title: "Colors of Africa",
      rewords: "Vibrant representation of African identity",
      medium: "Contemporary Art",
    },
    {
      exhibition_id: 10,
      title: "African Rhythm",
      rewords: "Rhythmic color patterns expressing African culture",
      medium: "Contemporary Art",
    },
  ];

  //create table-3(artworks) and insert data at startup
  mydb.run(
    `
CREATE TABLE IF NOT EXISTS artworks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exhibition_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  rewords TEXT,
  medium TEXT
)`,
    (error) => {
      if (error) {
        console.log("Error creating table artworks:", error);
      } else {
        console.log("Table artworks created successfully!");

        // remove old data
        mydb.run("DELETE FROM artworks", [], (err) => {
          if (err) {
            console.log("Error clearing table:", err);
            return;
          } else {
            console.log("Old artworks deleted");
          }

          // insert new data
          artworks.forEach((art) => {
            mydb.run(
              "INSERT INTO artworks (exhibition_id, title, rewords, medium) VALUES (?, ?, ?, ?)",
              [art.exhibition_id, art.title, art.rewords, art.medium],
              (err) => {
                if (err) {
                  console.log("Error inserting artwork record:", err);
                } else {
                  console.log("Added artwork:", art.title);
                }
              }
            );
          });
        });
      }
    }
  );
}

// DATABASE table4-shop items
function initTableShopItems(mydb) {
  const shopItems = [
    {
      id: 1,
      name: "Art Poster - Light and Shadow",
      price: 120,
      category: "Poster",
      image_url: "/images/shop1.jpg",
    },
    {
      id: 2,
      name: "Marble Sculpture Miniature",
      price: 450,
      category: "Sculpture",
      image_url: "/images/shop2.jpg",
    },
    {
      id: 3,
      name: "Abstract Painting Print",
      price: 300,
      category: "Print",
      image_url: "/images/shop3.jpg",
    },
    {
      id: 4,
      name: "Digital Art Tote Bag",
      price: 150,
      category: "Merchandise",
      image_url: "/images/shop4.jpg",
    },
    {
      id: 5,
      name: "Graphic Design Notebook",
      price: 80,
      category: "Stationery",
      image_url: "/images/shop5.jpg",
    },
    {
      id: 6,
      name: "Steel Garden Keychain",
      price: 60,
      category: "Accessory",
      image_url: "/images/shop6.jpg",
    },
    {
      id: 7,
      name: "Nordic Nature Mug",
      price: 100,
      category: "Home",
      image_url: "/images/shop7.jpg",
    },
    {
      id: 8,
      name: "East Meets West Calendar",
      price: 90,
      category: "Stationery",
      image_url: "/images/shop8.jpg",
    },
    {
      id: 9,
      name: "Abstract Evolution T-shirt",
      price: 180,
      category: "Clothing",
      image_url: "/images/shop9.jpg",
    },
    {
      id: 10,
      name: "Colors of Africa Cushion",
      price: 200,
      category: "Home",
      image_url: "/images/shop10.jpg",
    },
    {
      id: 11,
      name: "Museum Eco Tote",
      price: 130,
      category: "Merchandise",
      image_url: "/images/shop11.jpg",
    },
  ];
  //create table-4(shop ietms) and insert data at startup

  mydb.run(
    `
CREATE TABLE IF NOT EXISTS shop_items (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT
)`,
    (error) => {
      if (error) {
        console.log("Error creating table shop_items:", error);
      } else {
        console.log("Table shop_items created successfully!");
        // remove old data
        mydb.run("DELETE FROM shop_items", [], (err) => {
          if (err) {
            console.log("Error clearing table:", err);
            return;
          }
          console.log("Old shop_items deleted");
          // insert new data
          shopItems.forEach((item) => {
            mydb.run(
              "INSERT INTO shop_items (id, name, price, category, image_url) VALUES (?, ?, ?, ?, ?)",
              [item.id, item.name, item.price, item.category, item.image_url],
              (err) => {
                if (err) {
                  console.log("Error inserting shop item:", err);
                } else {
                  console.log("Added shop item:", item.name);
                }
              }
            );
          });
        });
      }
    }
  );
}

// DATABASE table5-user reviews
function initTableUserReviews(mydb) {
  const userReviews = [
    {
      shop_item_id: 1,
      username: "Emma",
      score: "78",
      comment: "Beautiful poster with vibrant colors!",
    },
    {
      shop_item_id: 1,
      username: "Daniel",
      score: "85",
      comment: "Love the artistic vibe, fits perfectly in my studio.",
    },
    {
      shop_item_id: 1,
      username: "Chloe",
      score: "80",
      comment: "Nice quality print, though shipping took a bit long.",
    },

    {
      shop_item_id: 2,
      username: "Lucas",
      score: "82",
      comment: "The marble detail is stunning, worth the price.",
    },
    {
      shop_item_id: 2,
      username: "Hannah",
      score: "88",
      comment: "Heavy and solid, feels premium in hand.",
    },
    {
      shop_item_id: 2,
      username: "Jack",
      score: "79",
      comment: "Great craftsmanship but smaller than expected.",
    },

    {
      shop_item_id: 3,
      username: "Mia",
      score: "87",
      comment: "Great quality print, looks amazing on my wall.",
    },
    {
      shop_item_id: 3,
      username: "Evelyn",
      score: "90",
      comment: "Crisp colors and good paper texture.",
    },
    {
      shop_item_id: 3,
      username: "Owen",
      score: "84",
      comment: "Nice design, arrived well packed.",
    },

    {
      shop_item_id: 4,
      username: "Noah",
      score: "90",
      comment: "Tote bag is durable and stylish.",
    },
    {
      shop_item_id: 4,
      username: "Ella",
      score: "92",
      comment: "Perfect for grocery shopping and daily use!",
    },
    {
      shop_item_id: 4,
      username: "Henry",
      score: "85",
      comment: "Good quality but wish the straps were longer.",
    },

    {
      shop_item_id: 5,
      username: "Sophia",
      score: "91",
      comment: "Notebook paper quality is smooth and nice.",
    },
    {
      shop_item_id: 5,
      username: "Grace",
      score: "88",
      comment: "Pretty cover and nice for journaling.",
    },
    {
      shop_item_id: 5,
      username: "Benjamin",
      score: "83",
      comment: "Good binding, pages don’t tear easily.",
    },

    {
      shop_item_id: 6,
      username: "Oliver",
      score: "83",
      comment: "Keychain is cute but a bit small.",
    },
    {
      shop_item_id: 6,
      username: "Aria",
      score: "85",
      comment: "Lovely accessory for my backpack!",
    },
    {
      shop_item_id: 6,
      username: "Leo",
      score: "79",
      comment: "Nice design, slightly overpriced though.",
    },

    {
      shop_item_id: 7,
      username: "Isabella",
      score: "84",
      comment: "Mug design is minimal and elegant.",
    },
    {
      shop_item_id: 7,
      username: "Aiden",
      score: "89",
      comment: "Keeps coffee warm longer than expected!",
    },
    {
      shop_item_id: 7,
      username: "Nora",
      score: "80",
      comment: "Cute mug, arrived in perfect condition.",
    },

    {
      shop_item_id: 8,
      username: "Ethan",
      score: "88",
      comment: "Love the calendar artwork!",
    },
    {
      shop_item_id: 8,
      username: "Lily",
      score: "90",
      comment: "Perfect size for my desk, very aesthetic.",
    },
    {
      shop_item_id: 8,
      username: "Samuel",
      score: "85",
      comment: "Great illustrations, could have thicker paper.",
    },

    {
      shop_item_id: 9,
      username: "Ava",
      score: "93",
      comment: "T-shirt fabric feels soft and premium.",
    },
    {
      shop_item_id: 9,
      username: "James",
      score: "88",
      comment: "Nice fit and breathable material.",
    },
    {
      shop_item_id: 9,
      username: "Scarlett",
      score: "90",
      comment: "Lovely print quality and comfortable wear.",
    },

    {
      shop_item_id: 10,
      username: "Liam",
      score: "92",
      comment: "The cushion brightens my room!",
    },
    {
      shop_item_id: 10,
      username: "Victoria",
      score: "89",
      comment: "Very soft and fluffy, great for sofa decor.",
    },
    {
      shop_item_id: 10,
      username: "Elijah",
      score: "86",
      comment: "Beautiful pattern but the cover is slightly loose.",
    },

    {
      shop_item_id: 11,
      username: "Amelia",
      score: "89",
      comment: "Perfect tote for everyday use!",
    },
    {
      shop_item_id: 11,
      username: "Mason",
      score: "91",
      comment: "Great size and sturdy stitching.",
    },
    {
      shop_item_id: 11,
      username: "Harper",
      score: "87",
      comment: "Stylish and practical, matches many outfits.",
    },
  ];

  //create table-5(user reviews) and insert data at startup
  db.run(
    `
CREATE TABLE IF NOT EXISTS user_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shop_item_id INTEGER NOT NULL,
  username TEXT NOT NULL,
  score TEXT NOT NULL,
  comment TEXT NOT NULL
)
`,
    (error) => {
      if (error) {
        console.log("Error creating table user_reviews:", error);
      } else {
        console.log("Table user_reviews created successfully!");
        // remove old data
        mydb.run("DELETE FROM user_reviews", [], (err) => {
          if (err) {
            console.log("Error clearing table:", err);
            return;
          }
          console.log("Old user_reviews deleted");
          // insert new data
          userReviews.forEach((review) => {
            mydb.run(
              "INSERT INTO user_reviews (shop_item_id, username, score, comment) VALUES (?, ?, ?, ?)",
              [
                review.shop_item_id,
                review.username,
                review.score,
                review.comment,
              ],
              (err) => {
                if (err) {
                  console.log("Error inserting review:", err);
                } else {
                  console.log("Added review by:", review.username);
                }
              }
            );
          });
        });
      }
    }
  );
}

//middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname));

// expose session to templates
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

//handlebars settings
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views", "layouts"),
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// routes
app.get("/", (req, res) => {
  res.render("index", {title: "Björka"});
});

// admin only for data modifications
function requireAdmin(req, res, next) {
  if (!req.session || !req.session.isAdmin) return res.redirect("/login");
  next();
}

// Login
app.get("/login", (req, res) => {
  res.render("login", {title: "Login"});
});
app.post("/login", (req, res) => {
  const {un, pw} = req.body || {};
  db.get(
    "SELECT id, username, password_hash, COALESCE(isAdmin,0) as isAdmin FROM users WHERE username = ?",
    [un],
    (err, user) => {
      if (err || !user) {
        return res.render("login", {
          title: "Login",
          error: "Wrong username! Please try again.",
        });
      }
      bcrypt.compare(pw, user.password_hash, (e2, ok) => {
        if (e2 || !ok)
          return res.render("login", {
            title: "Login",
            error: "Wrong password! Please try again.",
          });
        req.session.isLoggedIn = true;
        req.session.un = user.username;
        req.session.isAdmin = !!user.isAdmin;
        return res.render("loggedin", {title: "Logged in", un: user.username});
      });
    }
  );
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error while destroying the session: ", err);
    }
    res.redirect("/");
  });
});

// Users management (admin only)
// list users
app.get("/users", requireAdmin, (req, res) => {
  db.all(
    "SELECT id, username, isAdmin FROM users ORDER BY id DESC",
    [],
    (err, rows) => {
      if (err) return res.send("DB error");
      res.render("users", {title: "Users", users: rows});
    }
  );
});

// new user form
app.get("/users/new", requireAdmin, (req, res) => {
  res.render("users", {title: "New user", newMode: true});
});

// create user (hash password)
app.post("/users", requireAdmin, (req, res) => {
  const {username, password, isAdmin} = req.body || {};
  const hash = bcrypt.hashSync(password, 10);
  db.run(
    "INSERT INTO users (username, password_hash, isAdmin) VALUES (?, ?, ?)",
    [username, hash, isAdmin ? 1 : 0],
    (err) => {
      if (err) return res.send("Insert user error");
      res.redirect("/users");
    }
  );
});

// edit form
app.get("/users/:id/edit", requireAdmin, (req, res) => {
  db.get(
    "SELECT id, username, isAdmin FROM users WHERE id = ?",
    [req.params.id],
    (err, user) => {
      if (err || !user) return res.send("User not found");
      res.render("users", {title: "Edit user", user});
    }
  );
});

// update user (optional password change)
app.post("/users/:id", requireAdmin, (req, res) => {
  const {username, password, isAdmin} = req.body || {};
  if (password) {
    const hash = bcrypt.hashSync(password, 10);
    db.run(
      "UPDATE users SET username = ?, password_hash = ?, isAdmin = ? WHERE id = ?",
      [username, hash, isAdmin ? 1 : 0, req.params.id],
      (err) => {
        if (err) return res.send("Update user error");
        res.redirect("/users");
      }
    );
  } else {
    db.run(
      "UPDATE users SET username = ?, isAdmin = ? WHERE id = ?",
      [username, isAdmin ? 1 : 0, req.params.id],
      (err) => {
        if (err) return res.send("Update user error");
        res.redirect("/users");
      }
    );
  }
});

// delete user
app.post("/users/:id/delete", requireAdmin, (req, res) => {
  db.run("DELETE FROM users WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.send("Delete user error");
    res.redirect("/users");
  });
});

//home page

app.get("/shop", (req, res) => {
  db.all("SELECT * FROM shop_items", (err, items) => {
    if (err) return res.send(err.message);
    res.render("shop", {items});
  });
});
app.get("/shop/:id", (req, res) => {
  const itemId = req.params.id;
  const itemQuery = "SELECT * FROM shop_items WHERE id = ?";
  db.get(itemQuery, [itemId], (err, item) => {
    if (err) return res.send(err.message);

    if (!item) return res.send("Item not found");

    // INNER JOIN get reviews
    const reviewQuery = `
      SELECT user_reviews.username, user_reviews.score, user_reviews.comment
      FROM user_reviews
      INNER JOIN shop_items ON user_reviews.shop_item_id = shop_items.id
      WHERE shop_items.id = ?
    `;
    db.all(reviewQuery, [itemId], (err, reviews) => {
      if (err) return res.send(err.message);

      res.render("shopdetail", {item, reviews});
    });
  });
});

// Exhibitions page
// Exhibitions page with dynamic pagination
app.get("/exhibitions", (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const pageSize = Math.max(
    1,
    Math.min(3, parseInt(req.query.pageSize || "3", 10))
  );
  const offset = (page - 1) * pageSize;

  db.get("SELECT COUNT(*) AS c FROM exhibitions", [], (err1, countRow) => {
    if (err1) return res.send("Database error");
    const total = countRow ? countRow.c : 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    db.all(
      "SELECT * FROM exhibitions ORDER BY id ASC LIMIT ? OFFSET ?",
      [pageSize, offset],
      (err2, rows) => {
        if (err2) return res.send("Database error");
        const pagination = {
          current: page,
          total: totalPages,
          prev: page > 1 ? page - 1 : null,
          next: page < totalPages ? page + 1 : null,
          pageSize,
        };
        res.render("exhibitions", {exhibitions: rows, pagination});
      }
    );
  });
});
//Exhibition details page
// exhibitions CRUD operations
app.post("/exhibitions", upload.single("image"), (req, res) => {
  if (!req.session?.isAdmin) return res.redirect("/login");
  const {
    name,
    location,
    year,
    type,
    description,
    image_url,
    artist_name,
    artist_nationality,
    artist_age,
    artist_famous_work,
    artist_image_url,
    artwork_title,
    artwork_medium,
    artwork_rewords,
    artwork_image_url,
  } = req.body || {};
  const uploaded = req.file ? "/images/" + req.file.filename : null;
  db.run(
    "INSERT INTO exhibitions (id, name, location, description, year, type, image_url) VALUES ((SELECT IFNULL(MAX(id),0)+1 FROM exhibitions), ?, ?, ?, ?, ?, ?)",
    [
      name,
      location,
      description,
      Number(year) || null,
      type,
      uploaded || image_url || null,
    ],
    function (err) {
      if (err) return res.send("Insert error");
      // fetch newly created id
      db.get(
        "SELECT id FROM exhibitions ORDER BY id DESC LIMIT 1",
        [],
        (e2, row) => {
          if (e2 || !row) return res.redirect("/exhibitions");
          const exid = row.id;
          // optional seed artist for JOIN
          if (artist_name) {
            db.run(
              "INSERT INTO artists (exhibition_id, name, nationality, age, famous_work, image_url) VALUES (?, ?, ?, ?, ?, ?)",
              [
                exid,
                artist_name,
                artist_nationality || null,
                Number(artist_age) || null,
                artist_famous_work || null,
                artist_image_url || null,
              ]
            );
          }
          // optional seed artwork for JOIN
          if (artwork_title) {
            db.run(
              "INSERT INTO artworks (exhibition_id, title, rewords, medium, image_url) VALUES (?, ?, ?, ?, ?)",
              [
                exid,
                artwork_title,
                artwork_rewords || null,
                artwork_medium || null,
                artwork_image_url || null,
              ]
            );
          }
          res.redirect("/exhibitions/" + exid);
        }
      );
    }
  );
});

//update an exhibition
app.post("/exhibitions/update/:id", upload.single("image"), (req, res) => {
  if (!req.session?.isAdmin) return res.redirect("/login");
  const {name, location, year, type, description, image_url} = req.body || {};
  db.run(
    "UPDATE exhibitions SET name = ?, location = ?, year = ?, type = ?, description = ?, image_url = COALESCE(?, image_url) WHERE id = ?",
    [
      name,
      location,
      Number(year) || null,
      type,
      description,
      req.file ? "/images/" + req.file.filename : image_url || null,
      req.params.id,
    ],
    (err) => {
      if (err) return res.send("Update error");
      res.redirect("/exhibitions/" + req.params.id);
    }
  );
});
//delete an exhibition
app.post("/exhibitions/delete/:id", (req, res) => {
  if (!req.session?.isAdmin) return res.redirect("/login");
  db.run("DELETE FROM exhibitions WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.send("Delete error");
    res.redirect("/exhibitions");
  });
});

// Artworks CRUD operations
app.post(
  "/exhibition/:id/artworks",
  upload.single("image"),
  requireAdmin,
  (req, res) => {
    const eid = req.params.id;
    const {title, rewords, medium, image_url} = req.body || {};
    const uploaded = req.file ? "/images/" + req.file.filename : null;
    db.run(
      "INSERT INTO artworks (exhibition_id, title, rewords, medium, image_url) VALUES (?, ?, ?, ?, ?)",
      [
        eid,
        title,
        rewords || null,
        medium || null,
        uploaded || image_url || null,
      ],
      (err) => {
        if (err) return res.send("Insert artwork error");
        res.redirect("/exhibitions/" + eid);
      }
    );
  }
);

// Update an artwork
app.post(
  "/artworks/:aid/update",
  upload.single("image"),
  requireAdmin,
  (req, res) => {
    const aid = req.params.aid;
    const {title, rewords, medium, image_url, exhibition_id} = req.body || {};
    db.run(
      "UPDATE artworks SET title = ?, rewords = ?, medium = ?, image_url = COALESCE(?, image_url) WHERE id = ?",
      [
        title,
        rewords || null,
        medium || null,
        req.file ? "/images/" + req.file.filename : image_url || null,
        aid,
      ],
      (err) => {
        if (err) return res.send("Update artwork error");
        res.redirect("/exhibitions/" + (exhibition_id || ""));
      }
    );
  }
);

// Delete an artwork
app.post("/artworks/:aid/delete", requireAdmin, (req, res) => {
  const aid = req.params.aid;
  const {exhibition_id} = req.body || {};
  db.run("DELETE FROM artworks WHERE id = ?", [aid], (err) => {
    if (err) return res.send("Delete artwork error");
    res.redirect("/exhibitions/" + (exhibition_id || ""));
  });
});

// inner join in tables (Retrieve a single exhibition with its artists and artworks)
app.get("/exhibitions/:exid", (req, res) => {
  //get the exhibition ID from URL parameters
  const myEid = req.params.exid;
  //use chatgpt on Use gpt naming (Aliases-AS) to ensure the correct map deduplication logic and avoid failure due to column name conflicts
  //join artists and artworks related to exhibition,filter by the provided exhibition ID
  const query = `
    SELECT 
    e.id AS ex_id,
    e.name AS ex_name,
    e.year AS ex_year,
    e.location AS ex_location,
    e.type AS ex_type,
    e.description AS ex_desc,
    e.image_url AS ex_img,
    
    a.id AS artist_id,
    a.name AS artist_name,
    a.nationality AS artist_nationality,
    a.age AS artist_age,
    a.famous_work AS artist_famous_work,
    a.image_url AS artist_img,
    
    aw.id AS artwork_id,
    aw.title AS artwork_title,
    aw.rewords AS artwork_rewords,
    aw.medium AS artwork_medium

    FROM exhibitions e
    INNER JOIN artists a ON e.id = a.exhibition_id
    INNER JOIN artworks aw ON e.id = aw.exhibition_id
    WHERE e.id = ?;
  `;
  //execute the query
  db.all(query, [myEid], (err, rows) => {
    if (err) {
      console.error(err?.message);
      return res.status(500).send("DB error");
    }
    // if the JOIN returns no rows, query the display separately and render the empty association
    if (rows.length === 0) {
      return db.get(
        "SELECT * FROM exhibitions WHERE id = ?",
        [myEid],
        (e2, ex) => {
          if (e2 || !ex) return res.redirect("/exhibitions");
          const model = {
            exhibition: {
              id: ex.id,
              name: ex.name,
              location: ex.location,
              year: ex.year,
              type: ex.type,
              description: ex.description,
              image_url: ex.image_url,
            },
            artists: [],
            artworks: [],
          };
          return res.render("exhibition-details", model);
        }
      );
    }

    console.log(`---> Retrieved ${rows.length} rows from the database.`);
    console.log(`--> Rows: ${JSON.stringify(rows)}`);

    // extract exhibition information (all rows have same exhibition data)
    const exhibition = {
      id: rows[0].ex_id,
      name: rows[0].ex_name,
      location: rows[0].ex_location,
      year: rows[0].ex_year,
      type: rows[0].ex_type,
      description: rows[0].ex_desc,
      image_url: rows[0].ex_img,
    };
    // extract unique artists using Map to deduplicate by artist_id
    const artists = [
      ...new Map(
        rows.map((row) => [
          //Use artist_id as the key for the Map this ensures that each artist appears only once,
          // even if the SQL JOIN query repeats them across multiple rows
          row.artist_id,
          {
            id: row.artist_id,
            name: row.artist_name,
            nationality: row.artist_nationality,
            age: row.artist_age,
            famous_work: row.artist_famous_work,
            image_url: row.artist_img,
          },
        ])
        // Map automatically keeps only the last occurrence of each key,effectively deduplicating the artists.
      ).values(),
    ];

    // extract unique artworks using Map to deduplicate by artwork_id
    const artworks = [
      ...new Map(
        rows.map((row) => [
          row.artwork_id,
          {
            id: row.artwork_id,
            title: row.artwork_title,
            rewords: row.artwork_rewords,
            medium: row.artwork_medium,
          },
        ])
      ).values(),
    ];
    // debug logs for artists and artworks
    console.log(
      `---> Artists in this exhibition: ${artists.map((a) => a.name)}`
    );
    console.log(
      `---> Artworks in this exhibition: ${artworks.map((a) => a.title)}`
    );
    // prepare model to pass to template
    const model = {
      exhibition: exhibition,
      artists: artists,
      artworks: artworks,
    };
    // render exhibition-details page with model
    res.render("exhibition-details", model);
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
     password_hash TEXT NOT NULL,
     isAdmin INTEGER DEFAULT 0
  )`
);

// add isAdmin column if the table existed without it
db.run("ALTER TABLE users ADD COLUMN isAdmin INTEGER DEFAULT 0", (e) => {
  if (e && !/duplicate column name/i.test(e.message)) {
    console.log("users table alter error:", e.message);
  }
});

// Where credentials are embedded: the line below stores the bcrypt hash for "wdf#2025"
// Used chatgpt as help to ensures an 'admin' account exists with bcrypt-hashed password 'wdf#2025'
const ADMIN_HASH =
  "$2b$10$EIYwU6NE6V.0gAP8zIfVTeApl6DLjjHjN7FkIyArYqRw3N24xH41W";
db.get("SELECT id FROM users WHERE username = ?", ["admin"], (err, row) => {
  if (!row) {
    db.run(
      "INSERT INTO users (username, password_hash, isAdmin) VALUES (?, ?, 1)",
      ["admin", ADMIN_HASH]
    );
  } else {
    db.run(
      "UPDATE users SET isAdmin = 1 WHERE username = ? AND (isAdmin IS NULL OR isAdmin = 0)",
      ["admin"]
    );
  }
});

// LISTEN TO INCOMING REQUESTS
app.listen(port, function () {
  initTableExhibitions(db);
  initTableArtists(db);
  initTableArtworks(db);
  initTableShopItems(db);
  initTableUserReviews(db);
  console.log("Server is listening on port " + port + "...");
});
