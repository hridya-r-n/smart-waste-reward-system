const express = require("express");
const router = express.Router();

const User = require("../models/user");

// Leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
    .sort({ points: -1 })
    .limit(10)
    .select("name points");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;