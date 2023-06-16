const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport"); // Add this line to import passport
const routes = require("./routes/routes");
const passportConfig = require("./middleware/passportConfig"); // Update the import path

const app = express();

app.use(cors());
app.use(express.json());

app.use(
    session({
        secret: "AA3A969BD5424527F2293749123BDE82127818186F07ECA6908C29AFF5F38106",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true, // Use secure cookies (requires HTTPS)
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

passportConfig(passport); // Initialize passport with the configuration

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use("/api", routes);
