const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("./authorizationServer");

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
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({ error: "Token expired" });
      }

      // Verify the refresh token
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ error: "Invalid refresh token" });
        }

        // Generate new access and refresh tokens
        const accessToken = generateAccessToken(decoded.user_id);

        req.user = { user_id: decoded.user_id }; // Update the user information in req.user
        req.headers.authorization = `Bearer ${accessToken}`; // Update the authorization header
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          //secure: true, // Set to true if using HTTPS
          sameSite: "strict", // Adjust as needed based on your requirements
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
          path: "/refresh", // Set the path for the refresh token endpoint
        });

        next();
      });
    } else {
      return res.status(403).json({ error: "Invalid token" });
    }
  }
};

module.exports = authenticateToken;
