const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const RefreshToken = require("../models/RefreshToken");

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign({ uid: user.uid }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

// Generate Refresh Token
const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign({ uid: user.uid }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
  const hashedToken = await bcrypt.hash(refreshToken, 10);

  // Save the hashed refresh token in the database
  await RefreshToken.create({ token: hashedToken, userId: user.uid });

  return refreshToken;
};

// Login and issue tokens
exports.login = async (req, res) => {
  try {
    const { uid } = req.body; // Example authentication process
    if (!uid) {
      return res.status(400).json({ message: "UID is required" });
    }

    const accessToken = generateAccessToken({ uid });
    const refreshToken = await generateRefreshToken({ uid });

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Refresh tokens
exports.refreshTokens = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Check if the refresh token exists in the database
    const storedToken = await RefreshToken.findOne({ userId: decoded.uid });
    if (!storedToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Compare the stored hashed token with the provided token
    const isValid = await bcrypt.compare(refreshToken, storedToken.token);
    if (!isValid) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({ uid: decoded.uid });
    const newRefreshToken = await generateRefreshToken({ uid: decoded.uid });

    // Delete old token and store the new hashed token
    await RefreshToken.findByIdAndDelete(storedToken._id);

    res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error("Refresh Tokens Error:", error.message);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

// Logout and remove refresh token
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Verify and delete the token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    await RefreshToken.findOneAndDelete({ userId: decoded.uid });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
