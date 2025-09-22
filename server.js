const express = require("express");
const port = 8080;
const app = express();
app.get("/", (req, res) => res.send("Hello World"));
app.listen(port, () =>
  console.log(`Server up and running on http://localhost:${port}...`)
);
app.get("/cv", function (req, res) {
  res.sendFile("/cv-mycv-01.html");
});
