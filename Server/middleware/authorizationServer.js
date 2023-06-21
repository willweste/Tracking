const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());

// Generate Access Token
const generateAccessToken = (userId) => {
    return jwt.sign({ user_id: userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m", // Set the access token expiry time (e.g., 15 minutes)
    });
};

// Generate Refresh Token
const generateRefreshToken = () => {
    return jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d", // Set the refresh token expiry time (e.g., 7 days)
    });
};

// Token Refresh
app.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken;

    // Check if the refresh token exists
    if (!refreshToken) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid token" });
        }

        // Generate a new access token
        const accessToken = generateAccessToken(decoded.user_id);
        res.json({ accessToken });
    });
});

module.exports = app;
