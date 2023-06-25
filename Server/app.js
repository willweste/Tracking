const express = require('express');
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Set up CORS configuration


app.use(express.json());
// Set up CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        callback(null, true);
    },
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(
    session({
        secret: process.env.ACCESS_TOKEN_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true, // Use secure cookies (requires HTTPS)
            sameSite: 'none', // Allow cross-site cookies
        },
    })
);

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use('/api', routes);
