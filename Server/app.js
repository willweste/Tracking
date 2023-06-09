const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes");

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Use the routes defined in routes.js
app.use("/api", routes);

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
