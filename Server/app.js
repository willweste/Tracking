// app.js

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const routes = require("./routes/routes");
const authorizationServer = require("./middleware/authorizationServer"); // Import the authorization server
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(
    session({
        secret: process.env.ACCESS_TOKEN_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true, // Use secure cookies (requires HTTPS)
        },
    })
);

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use("/api", routes);

const authorizationPort = 5001; // Set the port for the authorization server
authorizationServer.app.listen(authorizationPort, () => {
    console.log(`Authorization server is running on port ${authorizationPort}`);
});
