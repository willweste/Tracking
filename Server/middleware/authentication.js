// authentication.js

const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("./authorizationServer");

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // User information is stored in req.user
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Check if it's an expired access token
      const refreshToken = req.headers["x-refresh-token"];

      if (!refreshToken) {
        return res.status(401).json({ error: "Token expired" });
      }

      // Verify the refresh token
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ error: "Invalid refresh token" });
        }

        // Generate a new access token using the refresh token's user ID
        const accessToken = generateAccessToken(decoded.user_id);
        req.user = { user_id: decoded.user_id }; // Update the user information in req.user
        req.headers.authorization = `Bearer ${accessToken}`; // Update the authorization header
        next();
      });
    } else {
      return res.status(403).json({ error: "Invalid token" });
    }
  }
};

module.exports = authenticateToken;
