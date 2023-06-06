const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const routes = require("./routes/routes"); // Update the path to the routes file

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", routes); // Update the route path

// Add a route for the root URL ("/")
app.get("/", (req, res) => {
  res.send("Hello, world!"); // Replace this with your desired response
});

app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
