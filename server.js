// PACKAGES
const express = require("express");
// VARIABLES AND CONSTANTS
const port = 8080;
const app = express();
// MIDDLEWARES
app.use(express.static("public"));
// ROUTES
app.get("/", (req, res) => res.sendFile(__dirname + "/views/main.html"));
// LISTEN TO INCOMING REQUESTS
app.listen(port, () =>
  console.log(`Server up and running on http://localhost:${port}...`)
);
