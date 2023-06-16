const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    req.user = decoded; // User information is stored in req.user
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) { // Fix the condition here
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = authenticateToken;
